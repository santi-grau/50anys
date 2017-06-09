window.THREE = require('three');
window.TweenMax = require('gsap');
window.BezierEasing = require('bezier-easing');

var Block = require('./views/block');
var Timer = require('./views/timer');
var Download = require('./views/download');
var Cursors = require('./views/cursors');
var Grid = require('./views/grid');
var Selector = require('./views/selector');
var Textures = require('./views/textures');
var SimplexNoise = require('simplex-noise');

var blockScripts = {
	empty : require('./views/blocks/empty'),
	solid : require('./views/blocks/solid'),
	worms : require('./views/blocks/worms'),
	vStripes : require('./views/blocks/vStripes'),
	hStripes : require('./views/blocks/hStripes'),
	dStripes1 : require('./views/blocks/dStripes1'),
	dStripes2 : require('./views/blocks/dStripes2'),
	grid : require('./views/blocks/grid'),
	grid2 : require('./views/blocks/grid2'),
	crissCross : require('./views/blocks/crissCross'),
	hDashes : require('./views/blocks/hDashes'),
	dotsSolid : require('./views/blocks/dotsSolid'),
	dotsHollow : require('./views/blocks/dotsHollow'),
	waves : require('./views/blocks/waves'),
	arrows : require('./views/blocks/arrows'),
	sprinkles : require('./views/blocks/sprinkles'),
	zigZag : require('./views/blocks/zigZag'),
	dotBig : require('./views/blocks/dotBig'),
	dotNeg : require('./views/blocks/dotNeg'),
	crosses : require('./views/blocks/crosses'),
	tinyDots : require('./views/blocks/tinyDots'),
	spaceDots : require('./views/blocks/spaceDots'),
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
	perspective : require('./views/blocks/perspective'),
	shadowBars : require('./views/blocks/shadowBars'),
	ascii : require('./views/blocks/ascii'),
	bars : require('./views/blocks/bars')
}

var App = function() {

	this.wsReady = true;
	
	var host = 'ws://54.93.229.125';
	if( location.origin.indexOf( 'localhost' ) !== -1 ) host = 'ws://localhost:8080';

	this.ws = new WebSocket(host);
	this.ws.addEventListener('error', this.ws_error.bind(this) );

	this.cursors = new Cursors( this );
	this.timer = new Timer( this );
	this.download = new Download( this );

	this.blockScripts = blockScripts;

	this.loadStates = {
		textures : false,
		ws : false
	}

	this.logos = [];

	this.moduleSize = 25;

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
	this.info = document.getElementById('info');
	this.infoSign = document.getElementById('infoSign');
	this.downloadSign = document.getElementById('downloadSign');
	
	this.prevBut = document.getElementById('prevBut');
	this.nextBut = document.getElementById('nextBut');
	this.logoCount = document.getElementById('logoCount');
	
	this.prevBut.addEventListener('click', this.prevLogo.bind(this) );
	this.nextBut.addEventListener('click', this.nextLogo.bind(this) );

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

	this.infoSign.addEventListener('click', this.infoShow.bind(this) );
	this.downloadSign.addEventListener('click', this.download.show.bind(this.download) );
	
	this.info.addEventListener('mousedown', this.infoHide.bind(this) );
	// this.download.addEventListener('mousedown', this.downloadHide.bind(this) );

	this.step();
}

App.prototype.updateLogo = function( ){
	this.containerEl.classList.remove('active');
	if( this.logos[ this.letterId ] ){
		setTimeout( function(){  this.makeLetter( this.logos[ this.letterId ] ); }.bind(this), 500 );
		return;
	}
	var oReq = new XMLHttpRequest();
	oReq.addEventListener('load', this.loadLetter.bind(this));
	oReq.open('GET', 'https://s3.eu-central-1.amazonaws.com/eina50/' + this.letterId + '.json');
	oReq.send();
}

App.prototype.updateLogoCount = function( ){
	var tt = String(this.letterId).split('');
	var ttt = '';
	for( var i = 0 ; i < 5 - tt.length ; i++ ) ttt += '0';
	for( var i =0 ; i < tt.length ; i++ ) ttt += tt[i];
	this.logoCount.innerHTML = ttt;
}

App.prototype.prevLogo = function( ){
	if( this.letterId > 0 ) this.letterId--;
	if( this.letterId == 0 ) this.prevBut.classList.remove('active');
	this.nextBut.classList.add('active');
	this.updateLogo();
}

App.prototype.nextLogo = function( ){
	if( this.letterId < this.totalLetters ) this.letterId++;
	if( this.letterId == this.totalLetters ) this.nextBut.classList.remove('active');
	this.prevBut.classList.add('active');
	this.updateLogo();
}

App.prototype.loadLetter = function( e ){
	var data = JSON.parse(e.currentTarget.responseText);
	this.logos[ this.letterId ] = data;
	this.makeLetter( data );
}

App.prototype.infoShow = function(  ){
	this.info.classList.add('active');
}

App.prototype.infoHide = function(  ){
	this.info.classList.remove('active');
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
	this.totalLetters ++;
	this.logos.push(d.data);
	this.makeLetter( d.data );
}

App.prototype.ws_setup = function( d ){
	this.id = d.data.id;
	this.data = JSON.parse(d.data.currentLetter);
	this.letterId = d.data.letterId;
	this.totalLetters = d.data.letterId;

	for( var i = 0 ; i < this.totalLetters ; i++ ) this.logos.push( null );
	this.logos.push( this.data );

	
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
	this.timer.setPosition( { x : event.clientX, y : event.clientY } );
}

App.prototype.sendCurrentMouse = function(){
	if( this.wsReady ) this.ws.send(  JSON.stringify( { 't' : 'cursor', 'id' : this.id, 'cursor' : this.cursor } ) );
}

App.prototype.makeLetter = function( data ){
	if( this.blocks ) for( var i = 0 ; i < this.blocks.length ; i++ ) this.blocks[i].destroy();
	for( var i = 0 ; i < this.two.scene.children.length ; i++ ){
		this.two.remove( this.two.scene.children[i] );
	}
	this.data = data;
	this.blocks = [];

	this.containerEl.style.width = data.viewBox[0] * this.moduleSize + 'px';
	this.containerEl.style.height = data.viewBox[1] * this.moduleSize + 'px';

	this.containerEl.style['margin-left'] = data.viewBox[0] / -2 * this.moduleSize - this.moduleSize / 2 + 'px';
	this.containerEl.style['margin-top'] = data.viewBox[1] / -2 * this.moduleSize - this.moduleSize + 'px';

	for( var i = 0 ; i < data.list.length ; i++ ) this.blocks.push( new Block( this, { x : data.list[i].x * this.moduleSize, y : data.list[i].y * this.moduleSize, w : data.list[i].w * this.moduleSize, h : data.list[i].h * this.moduleSize, t : data.list[i].t, a : data.list[i].a }, i ) );
	this.updateLogoCount();
	this.containerEl.classList.add('active');

	this.onResize();
	this.download.exportImage();
}

App.prototype.onReady = function( event ){
	this.loadStates[event] = true;

	for ( var key in this.loadStates ) if( !this.loadStates[key] ) return;

	clearInterval( this.byPassSocketTimer );
	setInterval( this.sendCurrentMouse.bind(this), 250 );
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

	if( this.data ) var offset = ( 1 - (this.data.viewBox[0]%2));
	
	this.grid.resize( offset );
	
}

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	this.renderer.render( this.scene, this.camera );
	for( var i = 0 ; i < this.blocks.length ; i++ ) this.blocks[i].step(time);
	this.cursors.step();
	this.timer.step();
};

var app = new App();