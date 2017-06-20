var Ws = function( parent ) {
	this.parent = parent;
	this.host = ( location.origin.indexOf( 'localhost' ) !== -1 ) ? 'ws://localhost:8080' : 'ws://54.93.229.125'; // host IP


	this.socket = new WebSocket( this.host );
	this.socket.addEventListener('error', this.error.bind( this ) );
	this.socket.addEventListener('message', this.message.bind( this ) );
}

Ws.prototype.message = function( e ){
	this.ready = true;
	var wsData = JSON.parse( e.data );
	if ( this.parent[ wsData.t ] ) this.parent[ wsData.t ](wsData);
}

Ws.prototype.error = function( ){
	console.log( 'We could not connect you... trying ot load offline experience ');
}

module.exports = Ws;