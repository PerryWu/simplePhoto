var redis = require("redis");
var client = redis.createClient();
var pillaId = 0;

client.on("error", function (err) {
	console.log("Error " + err);
});

client.scard("pillaList", function(err, value) {
	if(err)
		console.log("Fail to get pillList, perhaps the first time to use.");
	pillaId = value;
	console.log("init:" + value);
});

exports.create = function(obj, fn) {
	var multi = client.multi();
	multi.sadd("pillaList", pillaId, redis.print);
	multi.set("photo:"+pillaId+":name", obj.name, redis.print);
	multi.set("photo:"+pillaId+":path", obj.path, redis.print);
	pillaId++; // advance one when commands are queued.
	multi.exec(function(err, replies) {
		if(err) {
			console.log("create err:" + err);
		} else {
			console.log("create:" + replies);
			fn(null);
		}
	});
};

exports.findById = function(id, fn) {
	var photoKey = "photo:" + id +":";
	var rst = {id: id};
	console.log("photoKey:" + photoKey);
	client.get(photoKey + "name", function (err, name) {
		if(err)	return fn(err, null);
		console.log("findById:"+name);
		rst.name = name;

		client.get(photoKey + "path", function (err, path) {
			if(err)	return fn(err, null);
			console.log("findById:"+path);
			rst.path = path;
			console.log("findById:"+rst);
			return fn(null, rst);
		});
	});
};

exports.find = function(obj, fn) {
	var idList = [];
	var rst = [];
	client.smembers("pillaList", function(err, objs) {
		console.log("find:" + objs);
		for(var i in objs) {
			var index = objs[i];
			exports.findById(index, function(err, obj) {
				if(err) return fn(err, null);
				rst.push({name: obj.name, path: obj.path, id:obj.id});
				if(rst.length == objs.length) {
					console.log("find:" + rst);
					return fn(null, rst);
				}
			});
		}
	});
};
