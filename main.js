'use strict';

// ┌────────────────────────────────────────────────────────────────────┐
// | Filename: main.js
// └────────────────────────────────────────────────────────────────────┘

// ┌────────────────────────────────────────────────────────────────────┐
// | Require modules
// └────────────────────────────────────────────────────────────────────┘
var browserify = require('browserify-middleware');
var stringify = require('stringify');
var figlet = require('figlet');
var express = require("express");
var stylus = require('stylus');
var nib = require('nib');
var fs = require('fs');
var pckg = require('./package.json');
var pug = require('pug');

// ┌────────────────────────────────────────────────────────────────────┐
// | Initialize vars + constants
// └────────────────────────────────────────────────────────────────────┘
var app = express();
var port = Number( process.env.PORT || 5000 );

// ┌────────────────────────────────────────────────────────────────────┐
// | App setup
// └────────────────────────────────────────────────────────────────────┘

browserify.settings({ transform: [stringify(['.svg', '.glsl'])]});

app.set('views', __dirname + '/app/views');
app.use('/js', browserify('./app/js'));
app.set('view engine', 'pug');
app.use('/*.css', function(req, res){
	var reqUrl = req.originalUrl.split('/');
	var file = reqUrl[reqUrl.length-1].slice(0, -4);
	res.set('Content-Type', 'text/css').send( stylus.render( fs.readFileSync(__dirname + '/app/css/' + file + '.styl', 'utf-8') )); 
});

app.use(express.static(__dirname + '/app'));

// ┌────────────────────────────────────────────────────────────────────┐
// | Routes
// └────────────────────────────────────────────────────────────────────┘

app.get('/', function(req, res){
	res.render( 'main', { title: pckg.name });
});

app.get('/main2', function(req, res){
	res.render( 'main', { title: pckg.name });
});

app.get('/export', function(req, res){
	res.render( 'export', { title: pckg.name });
});

// ┌────────────────────────────────────────────────────────────────────┐
// | Init!!
// └────────────────────────────────────────────────────────────────────┘

app.listen(port);

figlet.fonts(function(err, fonts) {
	var font = fonts[Math.floor(Math.random() * fonts.length)];
	figlet('EINA 50 ANYS', { font : font},function(err, data) {
		console.log(data);
		console.log('└─────> ' + pckg.description);
		console.log('└─────> v ' + pckg.version);
		console.log('└─────> Listening on port: ' + port);
	});
});