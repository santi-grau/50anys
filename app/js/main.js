window.THREE = require('three');
window.TweenMax = require('gsap');
window.BezierEasing = require('bezier-easing');

var Block = require('./views/block')
var Grid = require('./views/grid');
var Selector = require('./views/selector');
var Textures = require('./views/textures');
var SimplexNoise = require('simplex-noise');

var blockScripts = {
	empty : require('./views/blocks/empty'),
	solid : require('./views/blocks/solid'),
	checkers : require('./views/blocks/checkers'),
	vStripes : require('./views/blocks/vStripes'),
	hStripes : require('./views/blocks/hStripes'),
	triangles : require('./views/blocks/triangles'),
	plus : require('./views/blocks/plus'),
	gridLines : require('./views/blocks/gridLines'),
	crissCross : require('./views/blocks/crissCross'),
	hDashes : require('./views/blocks/hDashes'),
	dotsSolid : require('./views/blocks/dotsSolid'),
	dotsHollow : require('./views/blocks/dotsHollow'),
	trisTras : require('./views/blocks/trisTras'),
	tdCubes : require('./views/blocks/tdCubes'),
	ls : require('./views/blocks/ls'),
	zigZag : require('./views/blocks/zigZag'),
	morisc : require('./views/blocks/morisc'),
	hexagon : require('./views/blocks/hexagon'),
	crazyLines : require('./views/blocks/crazyLines'),
	tinyDots : require('./views/blocks/tinyDots'),
	dotsDiagonal : require('./views/blocks/dotsDiagonal'),
	glitch : require('./views/blocks/glitch'),
	gradient : require('./views/blocks/gradient'),
	noise1 : require('./views/blocks/noise1'),
	noise2 : require('./views/blocks/noise2'),
	points : require('./views/blocks/points'),
	layers : require('./views/blocks/layers'),
	bigx : require('./views/blocks/bigx'),
	colorGradient : require('./views/blocks/colorGradient'),
	delaunay : require('./views/blocks/delaunay'),
	voronoi : require('./views/blocks/voronoi'),
	stepGradient : require('./views/blocks/stepGradient'),
	fiftyFifty : require('./views/blocks/fiftyFifty'),
	tunel : require('./views/blocks/tunel'),
	twoTris : require('./views/blocks/twoTris'),
	perspective : require('./views/blocks/perspective'),
	shadowBars : require('./views/blocks/shadowBars'),
	ascii : require('./views/blocks/ascii'),
	bars : require('./views/blocks/bars')
}

var Cursors = function(){
	this.containerEl = document.getElementById('cursors');
	this.oldPos = [];
	this.data = {}
}
Cursors.prototype.add = function( id, pos ){
	var div = document.createElement('div');
	div.classList.add('cursor');
	div.id = id;
	div.innerHTML = id;

	this.data[id] = {};
	this.data[id].el = div;
	this.data[id].pos = pos;
	this.data[id].oldPos = pos;
	this.containerEl.appendChild(div);
}

Cursors.prototype.remove = function( id ){
	var element = document.getElementById(id);
	element.parentNode.removeChild(element);
}

Cursors.prototype.step = function( ){
	for ( var key in this.data ){
		this.data[key].el.style.transform = 'translate3d(' + ( this.containerEl.offsetWidth / 2 + this.data[key].pos[0] ) + 'px, ' + ( this.containerEl.offsetHeight / 2 + this.data[key].pos[1] ) + 'px, 0)';	
		this.data[key].oldPos = this.data[key].pos;
	}
}

var App = function() {

	this.wsReady = true;
	this.ws = new WebSocket('ws://localhost:8080');
	this.ws.addEventListener('error', this.ws_error.bind(this) );

	this.cursors = new Cursors();

	this.blockScripts = blockScripts;

	this.loadStates = {
		textures : false,
		ws : false
	}

	this.moduleSize = 30;

	this.blocks = [];
	this.active = null;

	this.ws.onmessage = function (event) {
		var wsData = JSON.parse( event.data );
		if ( this[ 'ws_' + wsData.t ] ) this[ 'ws_' + wsData.t ](wsData);
	}.bind(this);


	this.event = new Event('textures');
	window.addEventListener('textures', function(){ this.onReady('textures') }.bind(this), false);


	this.textures = new Textures( this );

	this.containerEl = document.getElementById('main');
	this.containerOne = document.getElementById('one');
	this.containerTwo = document.getElementById('two');
	this.containerThree = document.getElementById('three');

	this.two = new Two( { width : this.containerTwo.offsetWidth, height : this.containerTwo.offsetHeight, autostart : true, type : Two.Types.canvas } ).appendTo( this.containerTwo );

	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.containerThree.appendChild( this.renderer.domElement );
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.grid = new Grid( this.moduleSize );

	this.seed = Math.random;
	this.simplexNoise = new SimplexNoise( this.seed );

	this.onResize();

	this.firstResize = true;

	this.cursor = [0,0];

	this.selector = new Selector( this );

	this.byPassSocketTimer = setTimeout( this.onReady.bind(this, 'ws'), 2000)
	
	window.addEventListener('resize', this.onResize.bind(this) );
	window.addEventListener('mousemove', this.mouseMove.bind(this) );

	this.step();
}

App.prototype.ws_error = function( d ){
	this.wsReady = false;
}

App.prototype.ws_cursor = function( d ){
	var id = d.id;
	var cursor = d.cursor;
	if( !this.cursors.data[id] ) this.cursors.add(id, cursor );
	else this.cursors.data[id].pos = cursor
}

App.prototype.ws_removeCursor = function( d ){
	var id = d.id;
	if( this.cursors.data[id] ) this.cursors.remove(id);
}

App.prototype.ws_updateLetter = function( d ){
	this.makeLetter( d.data );
}

App.prototype.ws_setup = function( d ){
	this.id = d.data.id;
	this.data = JSON.parse(d.data.currentLetter);
	this.onReady('ws');
}

App.prototype.ws_blockTexture = function( d ){
	this.blocks[d.id].setBlockTexture(d.blockTexture);
}

App.prototype.ws_blockAnimate = function( d ){
	this.blocks[d.id].setBlockAnimate(d.blockAnimate);
}


App.prototype.mouseMove = function(e){
	this.cursor = [ event.clientX - window.innerWidth / 2, event.clientY - window.innerHeight / 2 ];
}

App.prototype.sendCurrentMouse = function(){
	if( this.wsReady ) this.ws.send(  JSON.stringify( { 't' : 'cursor', 'id' : this.id, 'cursor' : this.cursor } ) );
}


App.prototype.makeLetter = function( data ){
	if( this.blocks ) for( var i = 0 ; i < this.blocks.length ; i++ ) this.blocks[i].destroy();

	this.blocks = [];

	this.containerEl.style.width = data.viewBox[0] * this.moduleSize + 'px';
	this.containerEl.style.height = data.viewBox[1] * this.moduleSize + 'px';

	this.containerEl.style['margin-left'] = data.viewBox[0] / -2 * this.moduleSize - this.moduleSize / 2 + 'px';
	this.containerEl.style['margin-top'] = data.viewBox[1] / -2 * this.moduleSize + 'px';

	for( var i = 0 ; i < data.list.length ; i++ ) this.blocks.push( new Block( this, { x : data.list[i].x * this.moduleSize, y : data.list[i].y * this.moduleSize, w : data.list[i].w * this.moduleSize, h : data.list[i].h * this.moduleSize, t : data.list[i].t, a : data.list[i].a }, i ) );
	this.onResize();
}

App.prototype.onReady = function( event ){
	this.loadStates[event] = true;

	// wait until all loadstates are true
	for ( var key in this.loadStates ) if( !this.loadStates[key] ) return;

	// remove sockettimer
	clearInterval( this.byPassSocketTimer );
	setInterval( this.sendCurrentMouse.bind(this), 2000 );
	this.makeLetter( this.data );

}

App.prototype.onResize = function(e) {
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

	this.grid.resize();
	clearTimeout( this.resizeStart );
	if( !this.firstResize ) this.resizeStart = setTimeout( this.onResizeEnd.bind(this), 400 );
	this.firstResize = false;
}

App.prototype.onResizeEnd = function(e) { }

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	this.renderer.render( this.scene, this.camera );
	for( var i = 0 ; i < this.blocks.length ; i++ ) this.blocks[i].step(time);
	this.cursors.step();
};

var app = new App();