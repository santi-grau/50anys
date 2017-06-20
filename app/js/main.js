window.THREE = require('three');
window.TweenMax = require('gsap');
window.BezierEasing = require('bezier-easing');
var SimplexNoise = require('simplex-noise');

var Dom = require('./views/dom');
var Ws = require('./views/ws');
var Preview = require('./views/preview');
var Textures = require('./views/textures');

var App = function() {
	this.containerTwo = document.getElementById('two');
	this.containerThree = document.getElementById('three');

	window.addEventListener( 'scroll', this.scroll.bind( this ) );
	window.addEventListener( 'resize', this.resize.bind( this ) );
	window.addEventListener( 'mousemove', this.mouseMove.bind(this) );

	this.seed = Math.random;
	this.simplexNoise = new SimplexNoise( this.seed );

	this.event = new Event('textures');
	window.addEventListener('textures', function(){ this.onReady('textures') }.bind(this), false);

	this.cursorPosition = [];
	this.sockets = false;
	this.textures = new Textures( this );

	this.two = new Two( { width : this.containerTwo.offsetWidth, height : this.containerTwo.offsetHeight, autostart : true, type : Two.Types.canvas } ).appendTo( this.containerTwo );
	
	this.twoPreviewGroup = this.two.makeGroup( );
	this.twoLogoGroup = this.two.makeGroup( );

	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.containerThree.appendChild( this.renderer.domElement );
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.threeLogoGroup = new THREE.Group();
	this.scene.add( this.threeLogoGroup );

	this.dom = new Dom( this );
	this.ws = new Ws( this );
	this.previews = [];

	this.resize();
	this.step();
}
App.prototype.onReady = function( event ){

}

App.prototype.cursor = function( d ){
	var id = d.id;
	var cursor = d.cursor;
	if( !this.dom.cursors.data[id] ) this.dom.cursors.add(id, cursor );
	else this.dom.cursors.data[id].pos = cursor;
}

App.prototype.removeCursor = function( d ){
	var id = d.id;
	if( this.dom.cursors.data[id] ) this.dom.cursors.remove(id);
}

App.prototype.setup = function( message ){ // Connection from Websocket
	this.sockets = true;
	var data = message.data;
	this.socketId = data.id;

	// Instantiate previews
	var positions = JSON.parse( data.positions );

	for( var i = 0 ; i < positions.length ; i++ ) this.previews.push( new Preview( this, positions[i], i ) );

	var currentLetter = JSON.parse( data.currentLetter );
	this.previews[ this.previews.length - 1 ].logoData = currentLetter;
	this.setModuleSize( currentLetter );

	this.previews[this.previews.length - 1].loadLogo();
	this.dom.init( this.previews.length );

	setInterval( this.sendCurrentMouse.bind(this), 250 );
}

App.prototype.sendCurrentMouse = function(){
	if( this.ws.ready ) this.ws.socket.send(  JSON.stringify( { 't' : 'cursor', 'id' : this.socketId, 'cursor' : this.cursorPosition } ) );
}

App.prototype.updateLetter = function( d ){ // New letter created
	console.log(d)
	// this.dom.addLetter();
	// this.previews.push( new Preview( this, d.positions, this.previews.length - 1, d.data ) )
}

App.prototype.blockTexture = function( d ){
	this.previews[ this.previews.length - 1 ].blocks[d.id].setBlockTexture(d.blockTexture);
}

App.prototype.blockAnimate = function( d ){
	this.previews[ this.previews.length - 1 ].blocks[d.id].setBlockAnimate(d.blockAnimate);
}

App.prototype.setModuleSize = function( data ){
	var screenAr = ( window.innerHeight * 0.6 ) / window.innerWidth;
	var logoAr = data.viewBox[1] / data.viewBox[0];
	if( screenAr < logoAr ){
		if( data.viewBox[1] * 30 < window.innerHeight * 0.7 ) this.moduleSize = 30;
		else if( data.viewBox[1] * 25 < window.innerHeight * 0.7 ) this.moduleSize = 25;
		else this.moduleSize = 15;
	} else {
		if( data.viewBox[0] * 30 < window.innerWidth * 0.75 ) this.moduleSize = 30;
		else if( data.viewBox[0] * 25 < window.innerWidth * 0.75 ) this.moduleSize = 25;
		else this.moduleSize = 15;
	}

	if( this.moduleSize == 15 ) this.lineWidth = 2;
	if( this.moduleSize == 25 ) this.lineWidth = 4;
	if( this.moduleSize == 30 ) this.lineWidth = 5;
}

App.prototype.scroll = function( e ){
	this.scrolling = true;
	if( this.scrollTimer ) this.scrollTimer = clearTimeout( this.scrollTimer );
	if( !this.scrollTimer ) this.scrollTimer = setTimeout( this.scrollEnd.bind( this ), 100 );
	this.dom.scroll();
}

App.prototype.mouseMove = function( event ){
	this.cursorPosition = [ event.clientX - window.innerWidth / 2, event.clientY - window.innerHeight / 2 ];
	this.dom.timer.setPosition( { x : event.clientX, y : event.clientY } );
}

App.prototype.resize = function( e ){
	if( this.resizeTimer ) this.resizeTimer = clearTimeout( this.resizeTimer );
	if( !this.resizeTimer ) this.resizeTimer = setTimeout( this.resizeEnd.bind( this ), 400 );

	this.renderer.setSize( this.containerThree.offsetWidth * 2, this.containerThree.offsetHeight * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + this.containerThree.offsetWidth + 'px; height:' + this.containerThree.offsetHeight + 'px' );
	this.camera.left = this.containerThree.offsetWidth / - 2;
	this.camera.right = this.containerThree.offsetWidth / 2;
	this.camera.top = this.containerThree.offsetHeight / 2;
	this.camera.bottom = this.containerThree.offsetHeight / - 2;
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix();

	this.two.width = this.containerThree.offsetWidth;
	this.two.height = this.containerThree.offsetHeight;
}

App.prototype.scrollEnd = function( ){
	this.scrolling = false;
	this.previews[this.dom.current].loadLogo();
	this.dom.scrollEnd();
}

App.prototype.resizeEnd = function( ){
	this.scrollEnd();
}

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	if( !this.scrolling && this.previews[this.dom.current] ) if( this.previews[this.dom.current].state.logo ) this.previews[this.dom.current].step( time );
	this.dom.step();
	this.renderer.render( this.scene, this.camera );
};

var app = new App();