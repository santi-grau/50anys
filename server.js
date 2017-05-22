'use strict';

// ┌────────────────────────────────────────────────────────────────────┐
// | Filename: server.js
// └────────────────────────────────────────────────────────────────────┘

var figlet = require('figlet');
var WebSocketServer = require('ws').Server;
var CronJob = require('cron').CronJob;
var MakeLetter = require('./routes/makeLetter');
var fs = require('fs');

var wss = new WebSocketServer({port:8080});
var currentLetter = JSON.parse( fs.readFileSync('./letters/current.json', 'utf8') );

var job = new CronJob({
	cronTime: '0 0 * * * *',
	onTick: function() {
		var totalLetters = 0;
		var letters = fs.readdirSync('./letters');
		for( var i = 0 ; i < letters.length ; i++ ) if( letters[i].indexOf('.json') ) totalLetters++;
		
		fs.writeFile('./letters/' + ( totalLetters - 1 ) + '.json',  JSON.stringify( currentLetter ), function(err) {
			if(err) return console.log(err);
		});

		currentLetter = new MakeLetter().blocks;
		
		fs.writeFile("./letters/current.json", JSON.stringify( currentLetter ), function(err) {
			if(err) return console.log(err);
			wss.clients.forEach(function each(client) {
				if ( client.readyState ) client.send( JSON.stringify( { t : 'updateLetter', data : currentLetter } ) );
			});
			console.log("New letter created");
		}); 
	},
	start: true
});

wss.on('connection', function connection(ws) {
	var id = 'c' + new Date().getTime();
	ws.id = id;
	
	ws.send( JSON.stringify( { t : 'setup', data : { id : id, currentLetter : JSON.stringify(currentLetter) } } ) );

	ws.on('message', function incoming(data) {
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