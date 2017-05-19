'use strict';

// ┌────────────────────────────────────────────────────────────────────┐
// | Filename: server.js
// └────────────────────────────────────────────────────────────────────┘

// ┌────────────────────────────────────────────────────────────────────┐
// | Require modules
// └────────────────────────────────────────────────────────────────────┘
var figlet = require('figlet');
var WebSocketServer = require('ws').Server;

var CronJob = require('cron').CronJob;
// var MakeLetter = require('./routes/makeLetter');

// var server = http.createServer();
// server.listen(8080);
var wss = new WebSocketServer({port:8080});



var clients = {

}

 
wss.on('connection', function connection(ws) {
	var id = 'c' + new Date().getTime();
	ws.id = id;
	ws.send( JSON.stringify( { t : 'id', id : id } ) );

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
	figlet('E50A', { font : 'Impossible'},function(err, data) {
		console.log(data);
		console.log('└─────> Websocket using port: 8080');
	});
});