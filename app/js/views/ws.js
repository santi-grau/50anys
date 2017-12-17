var Ws = function( parent ) {
	this.parent = parent;
	this.host = ( location.origin.indexOf( 'localhost' ) !== -1 ) ? 'ws://localhost:8080' : 'ws://ec2-54-93-229-125.eu-central-1.compute.amazonaws.com:8080'; // host IP
	this.host = 'ws://ec2-54-93-229-125.eu-central-1.compute.amazonaws.com:8080'; // host IP


	// this.socket = new WebSocket( this.host );

	try {
    	this.socket = new WebSocket( this.host );
	} catch ( e ) {
    	console.warn(e);
	}

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