window.THREE = require('three');
window.TweenMax = require('gsap');

var modules = require('./../media/blocks2.svg');

var Block = require('./views/block')
var Grid = require('./views/grid');
var Textures = require('./views/textures');
var SimplexNoise = require('simplex-noise');

var App = function() {

	this.moduleSize = 30;

	this.blocks = [];
	this.active = null;

	this.event = new Event('textures');
	window.addEventListener('textures', this.onReady.bind(this), false);

	this.textures = new Textures( this );

	this.containerEl = document.getElementById('main');
	this.containerOne = document.getElementById('one');
	this.containerTwo = document.getElementById('two');
	this.containerThree = document.getElementById('three');

	this.two = new Two( { width: this.containerTwo.offsetWidth, height: this.containerTwo.offsetHeight, autostart : true, type : Two.Types.canvas } ).appendTo( this.containerTwo );
	
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.containerThree.appendChild( this.renderer.domElement );
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.grid = new Grid( this.moduleSize );

	this.seed = Math.random;
	this.simplexNoise = new SimplexNoise( this.seed );

	this.onResize();

	this.firstResize = true;
	
	window.addEventListener('resize', this.onResize.bind(this) );
	window.addEventListener('keydown', this.onKeyDown.bind(this) );
	window.addEventListener('keyup', this.onKeyUp.bind(this) );

	this.step();
}

App.prototype.onReady = function(){
	var mods = new DOMParser().parseFromString(modules, "image/svg+xml");
	var viewBox = mods.getElementsByTagName('svg')[0].getAttribute('viewBox').split(' ');

	console.log(viewBox)
	this.containerEl.style.width = viewBox[2] * this.moduleSize + 'px';
	this.containerEl.style.height = viewBox[3] * this.moduleSize + 'px';

	var bls = mods.getElementsByTagName('rect');
	for( var i = 0 ; i < bls.length ; i++ ) this.blocks.push( new Block( this, { x : bls[i].getAttribute('x') * this.moduleSize, y : bls[i].getAttribute('y') * this.moduleSize, w : bls[i].getAttribute('width') * this.moduleSize, h : bls[i].getAttribute('height') * this.moduleSize } ) );
	this.onResize();
}

App.prototype.onKeyDown = function(e){
	// console.log('down ' + e.keyCode)
	// console.log(this.active);
	// this.active.seqGen(1);
	if( this.active && e.keyCode == 39 ) this.active.seqGen(1);
	if( this.active && e.keyCode == 37 ) this.active.seqGen(0);
}

App.prototype.onKeyUp = function(e){
	// console.log('up')
}

App.prototype.onResize = function(e) {
	this.renderer.setSize( this.containerThree.offsetWidth * 2, this.containerThree.offsetHeight * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + this.containerThree.offsetWidth + 'px; height:' + this.containerThree.offsetHeight + 'px' );
	this.camera.left = this.containerThree.offsetWidth / - 2;
	this.camera.right = this.containerThree.offsetWidth / 2;
	this.camera.top = this.containerThree.offsetHeight / 2;
	this.camera.bottom = this.containerThree.offsetHeight / - 2;
	this.camera.position.z = 1;
	this.camera.updateProjectionMatrix();

	this.grid.resize();
	clearTimeout( this.resizeStart );
	if( !this.firstResize ) this.resizeStart = setTimeout( this.onResizeEnd.bind(this), 400 );
	this.firstResize = false;
}

App.prototype.onResizeEnd = function(e) {

}

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	this.renderer.render( this.scene, this.camera );

	for( var i = 0 ; i < this.blocks.length ; i++ ){
		this.blocks[i].step(time);
	}
	// for( i = 0 ; i < this.wBlocks.length ; i++ ){
	// 	this.hBlocks[i].step();
	// 	this.wBlocks[i].step();
	// }
};

var app = new App();