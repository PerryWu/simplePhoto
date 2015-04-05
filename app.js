/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var photos = require('./routes/photos');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined'));
//app.use(express.bodyParser({ uploadDir: path.join(__dirname, 'public/photos'), keepExtensions: true }));
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({extended: false }));
//app.use(express.methodOverride());
app.use(methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/users', user.list);
app.get('/', photos.list);
app.get('/upload', photos.form);
app.post('/upload', photos.submit(app.get('photos')));
app.get('/photo/:id/download', photos.download(app.get('photos')));

// development only
if ('development' == app.get('env')) {
	app.use(errorhandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
