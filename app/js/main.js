window.THREE = require('three');
window.TweenMax = require('gsap');
window.triangulate = require('delaunay-triangulate');
window.voronoi = require('voronoi');

var Block = require('./views/block')
var Grid = require('./views/grid');
var Selector = require('./views/selector');
var Textures = require('./views/textures');
var SimplexNoise = require('simplex-noise');
 
var ws = new WebSocket('ws://localhost:8080');


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

	this.cursors = new Cursors();

	this.blockScripts = blockScripts;

	this.loadStates = {
		textures : false,
		ws : false
	}

	this.moduleSize = 30;

	this.blocks = [];
	this.active = null;


	ws.onopen = function () { this.onReady('ws') }.bind(this);

	ws.onmessage = function (event) {
		// console.log( 'WS --- > message received' );
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
	
	window.addEventListener('resize', this.onResize.bind(this) );
	window.addEventListener('mousemove', this.mouseMove.bind(this) );

	this.step();
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

App.prototype.ws_id = function( d ){
	this.id = d.id;
}

App.prototype.mouseMove = function(e){
	this.cursor = [ event.clientX - window.innerWidth / 2, event.clientY - window.innerHeight / 2 ];
}

App.prototype.sendCurrentMouse = function(){
	ws.send(  JSON.stringify( { 't' : 'cursor', 'id' : this.id, 'cursor' : this.cursor } ) );
}

App.prototype.onReady = function( event ){

	this.loadStates[event] = true;

	

	// wait until all loadstates are true
	for ( var key in this.loadStates ) if( !this.loadStates[key] ) return;

	setInterval( this.sendCurrentMouse.bind(this), 2000 );

	var modTest = { viewBox: [ 21, 14 ],
  list: 
   [ { x: 14, y: 2, w: 4, h: 1, t: 'points', a: 1 },
     { x: 18, y: 2, w: 1, h: 9, t: 'voronoi', a: 0 },
     { x: 1, y: 2, w: 7, h: 1, t: 'plus', a: 1 },
     { x: 9, y: 8, w: 1, h: 2, t: 'perspective', a: 1 },
     { x: 2, y: 9, w: 1, h: 1, t: 'delaunay', a: 1 },
     { x: 17, y: 6, w: 1, h: 3, t: 'crazyLines', a: 0 },
     { x: 1, y: 1, w: 8, h: 1, t: 'dotsDiagonal', a: 0 },
     { x: 13, y: 5, w: 1, h: 8, t: 'hexagon', a: 0 },
     { x: 2, y: 11, w: 4, h: 1, t: 'twoTris', a: 1 },
     { x: 2, y: 6, w: 6, h: 1, t: 'ls', a: 0 },
     { x: 12, y: 2, w: 1, h: 8, t: 'ls', a: 1 },
     { x: 6, y: 12, w: 1, h: 1, t: 'noise2', a: 0 },
     { x: 13, y: 1, w: 4, h: 1, t: 'gradient', a: 1 },
     { x: 14, y: 11, w: 1, h: 1, t: 'noise2', a: 0 },
     { x: 11, y: 4, w: 1, h: 6, t: 'gradient', a: 1 },
     { x: 1, y: 10, w: 3, h: 1, t: 'morisc', a: 0 },
     { x: 1, y: 5, w: 7, h: 1, t: 'glitch', a: 0 },
     { x: 19, y: 7, w: 1, h: 1, t: 'ascii', a: 0 },
     { x: 8, y: 9, w: 1, h: 2, t: 'gridLines', a: 0 },
     { x: 19, y: 4, w: 1, h: 3, t: 'bigx', a: 0 },
     { x: 7, y: 7, w: 1, h: 4, t: 'tunel', a: 0 },
     { x: 17, y: 11, w: 2, h: 1, t: 'crissCross', a: 1 },
     { x: 11, y: 3, w: 1, h: 1, t: 'noise1', a: 1 },
     { x: 14, y: 12, w: 4, h: 1, t: 'layers', a: 0 },
     { x: 19, y: 8, w: 1, h: 3, t: 'crazyLines', a: 0 },
     { x: 3, y: 3, w: 1, h: 1, t: 'bigx', a: 0 },
     { x: 13, y: 2, w: 1, h: 3, t: 'solid', a: 0 },
     { x: 6, y: 11, w: 3, h: 1, t: 'shadowBars', a: 0 },
     { x: 3, y: 12, w: 3, h: 1, t: 'dotsHollow', a: 0 },
     { x: 8, y: 6, w: 1, h: 2, t: 'delaunay', a: 0 },
     { x: 17, y: 9, w: 1, h: 2, t: 'morisc', a: 1 },
     { x: 15, y: 11, w: 2, h: 1, t: 'empty', a: 0 },
     { x: 17, y: 4, w: 1, h: 2, t: 'hDashes', a: 0 },
     { x: 1, y: 4, w: 3, h: 1, t: 'noise2', a: 1 },
     { x: 12, y: 10, w: 1, h: 2, t: 'gridLines', a: 1 },
     { x: 3, y: 9, w: 1, h: 1, t: 'morisc', a: 0 },
     { x: 8, y: 2, w: 1, h: 1, t: 'stepGradient', a: 0 },
     { x: 9, y: 10, w: 1, h: 1, t: 'fiftyFifty', a: 1 },
     { x: 1, y: 3, w: 2, h: 1, t: 'voronoi', a: 1 },
     { x: 1, y: 9, w: 1, h: 1, t: 'layers', a: 1 },
     { x: 17, y: 3, w: 1, h: 1, t: 'vStripes', a: 0 },
     { x: 17, y: 1, w: 1, h: 1, t: 'tunel', a: 0 },
     { x: 8, y: 8, w: 1, h: 1, t: 'triangles', a: 0 },
     { x: 11, y: 10, w: 1, h: 1, t: 'checkers', a: 1 },
     { x: 19, y: 3, w: 1, h: 1, t: 'tunel', a: 1 },
     { x: 1, y: 6, w: 1, h: 1, t: 'hexagon', a: 1 },
     { x: 7, y: 12, w: 1, h: 1, t: 'tdCubes', a: 1 },
     { x: 9, y: 7, w: 1, h: 1, t: 'bigx', a: 1 } ] }

	this.containerEl.style.width = modTest.viewBox[0] * this.moduleSize + 'px';
	this.containerEl.style.height = modTest.viewBox[1] * this.moduleSize + 'px';

	this.containerEl.style['margin-left'] = modTest.viewBox[0] / -2 * this.moduleSize - this.moduleSize / 2 + 'px';
	this.containerEl.style['margin-top'] = modTest.viewBox[1] / -2 * this.moduleSize + 'px';

	for( var i = 0 ; i < modTest.list.length ; i++ ) this.blocks.push( new Block( this, { x : modTest.list[i].x * this.moduleSize, y : modTest.list[i].y * this.moduleSize, w : modTest.list[i].w * this.moduleSize, h : modTest.list[i].h * this.moduleSize, t : modTest.list[i].t, a : modTest.list[i].a } ) );
	this.onResize();
}

App.prototype.onResize = function(e) {
	this.renderer.setSize( this.containerThree.offsetWidth * 2, this.containerThree.offsetHeight * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + this.containerThree.offsetWidth + 'px; height:' + this.containerThree.offsetHeight + 'px' );
	this.camera.left = this.containerThree.offsetWidth / - 2;
	this.camera.right = this.containerThree.offsetWidth / 2;
	this.camera.top = this.containerThree.offsetHeight / 2;
	this.camera.bottom = this.containerThree.offsetHeight / - 2;
	this.camera.position.z = 100;
	this.camera.updateProjectionMatrix();

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