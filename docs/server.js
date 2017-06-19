'use strict';

// ┌────────────────────────────────────────────────────────────────────┐
// | Filename: server.js
// └────────────────────────────────────────────────────────────────────┘
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var figlet = require('figlet');
var WebSocketServer = require('ws').Server;
var CronJob = require('cron').CronJob;
var fs = require('fs');
var cors = require('cors');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3('aws-sdk/clients/s3');
var path = require('path');
var port = Number( process.env.PORT || 8080 );
var MakeLetter = require('./routes/makeLetter');

var app = express();
app.use(cors());
var jsonParser = bodyParser.json();

var server = http.createServer(app);
var wss = new WebSocketServer({ server });

server.listen(port);

var Srvr = function(){
	this.totalFiles = 0;

	if (fs.existsSync('current.json')) {
		this.currentLetter = JSON.parse( fs.readFileSync('./current.json', 'utf8') );
	} else {
		this.currentLetter = new MakeLetter().blocks;
		fs.writeFileSync("./current.json", JSON.stringify( this.currentLetter ) ); 
	}

	this.positions = JSON.parse( fs.readFileSync('./positions.json', 'utf8') );
	// this.savePositions( this.currentLetter );

	this.getFiles();
}

Srvr.prototype.listFiles = function(err, data){
	if(err) console.log(err);
	this.totalFiles = data.Contents.length;
}

Srvr.prototype.savePositions = function( data ){
	function n(n){ return n > 9 ? "" + n: "0" + n; }
	var v = '' + n(data.viewBox[0]) + '' + n(data.viewBox[1]);
	for( var i = 0 ; i < data.list.length ; i++ ) v += n(data.list[i].x) + '' + n(data.list[i].y) + '' +  n(data.list[i].w) + '' + n(data.list[i].h);
	this.positions.push(v);
	fs.writeFileSync('./positions.json', JSON.stringify( this.positions ) ); 
}

Srvr.prototype.getFiles = function(){
	s3.listObjects({ Bucket: 'eina50' }, this.listFiles.bind(this));
}

Srvr.prototype.makeNew = function(){
	var uploadParams = {Bucket: 'eina50', Key: this.totalFiles + '.json', Body: JSON.stringify( this.currentLetter ) };
	s3.upload ( uploadParams , function (err, data) {
		if (err) console.log("Error", err);
		if (data){
			console.log("Upload Success", data.Location);
			this.totalFiles++;
		}
	}.bind(this));

	

	this.currentLetter = new MakeLetter().blocks;
	this.savePositions(this.currentLetter);

	fs.writeFile("./current.json", JSON.stringify( this.currentLetter ), function(err) {
		if(err) return console.log(err);
		wss.clients.forEach(function each(client) {
			if ( client.readyState ) client.send( JSON.stringify( { t : 'updateLetter', data : this.currentLetter, positions : this.positions[ this.positions.length - 1 ] } ) );
		}.bind(this));
		console.log("New letter created");
	}.bind(this)); 

}

Srvr.prototype.saveCurrent = function(){
	fs.writeFileSync("./current.json", JSON.stringify( this.currentLetter ));
}

var srvr = new Srvr();

var makeLetter = new CronJob({
	// cronTime: '0 * * * * *',
	cronTime: '0 0 0 * * *',
	onTick : srvr.makeNew.bind(srvr),
	start: true,
	timeZone: 'Europe/Madrid'
});

var saveCurrent = new CronJob({
	cronTime: '0 * * * * *',
	onTick : srvr.saveCurrent.bind(srvr),
	start: true
});

wss.on('connection', function connection(ws) {
	var id = 'c' + new Date().getTime();
	ws.id = id;

	ws.send( JSON.stringify( { t : 'setup', data : { id : id, currentLetter : JSON.stringify(srvr.currentLetter), letterId : srvr.totalFiles, positions : JSON.stringify( srvr.positions )  } } ) );

	ws.on('message', function incoming(data) {
		var d = JSON.parse(data);
		if( d.t == 'blockTexture' ) srvr.currentLetter.list[d.id].t = d.blockTexture;
		if( d.t == 'blockAnimate' ) srvr.currentLetter.list[d.id].a = d.blockAnimate;
	
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState ) {
				client.send( data );
			}
		});
	});

	ws.on('close', function close(data) {
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState ) {
				client.send( JSON.stringify( { t : 'removeCursor', id : ws.id } ) );
			}
		});
		
	});

});

figlet.fonts(function(err, fonts) {
	var font = fonts[Math.floor(Math.random() * fonts.length)];
	figlet('E50A', { font : font},function(err, data) {
		console.log(data);
		console.log('└─────> Websocket using port: 8080');
	});
});