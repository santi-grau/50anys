window.TweenMax = require('gsap');


var modules = require('./../media/blocks2.svg');
var mods = new DOMParser().parseFromString(modules, "image/svg+xml");

var viewBox = mods.getElementsByTagName('svg')[0].getAttribute('viewBox').split(' ');
console.log(parseInt(viewBox[2]), parseInt(viewBox[3]));

var bls = mods.getElementsByTagName('rect');
for( var i = 0 ; i < bls.length ; i++ ){
	console.log(bls[i]);
}



var svgBlocks = require('./../media/blocks.svg');
var Grid = require('./views/grid');
var SimplexNoise = require('simplex-noise');

var blockScripts = {
	empty : require('./views/blocks/empty'),
	hStripes : require('./views/blocks/hStripes'),
	noisePattern : require('./views/blocks/noisePattern'),
	vStripes : require('./views/blocks/vStripes'),
	solid : require('./views/blocks/solid'),
	stepGradient : require('./views/blocks/stepGradient'),
	tunel : require('./views/blocks/tunel'),
	layers : require('./views/blocks/layers'),
	fiftyFifty : require('./views/blocks/fiftyFifty'),
	offset : require('./views/blocks/offset'),
	checkers : require('./views/blocks/checkers'),
	switch : require('./views/blocks/switch')
}



var App = function() {
	
	this.moduleSize = 30;
	
	this.containerEl = document.getElementById('main');

	

	this.blocks = [];	
	this.grid = new Grid( 30 );

	this.seed = Math.random;
	this.simplexNoise = new SimplexNoise( this.seed );

	this.onResize();

	var blocks = new DOMParser().parseFromString(svgBlocks, "image/svg+xml").getElementsByTagName('rect');
	
	this.maxx = -10000;
	this.maxy = -10000;
	this.minx = 10000;
	this.miny = 10000;

	for( var i = 0 ; i < blocks.length ; i++ ){
		var block = blocks[i];

		this.maxx = Math.max( this.maxx, parseInt(block.getAttribute('x')) );
		this.minx = Math.min( this.minx, parseInt(block.getAttribute('x')) );
		this.maxy = Math.max( this.maxy, parseInt(block.getAttribute('y')) );
		this.miny = Math.min( this.miny, parseInt(block.getAttribute('y')) );
		
		this.blocks[i] = {
			x : parseInt(block.getAttribute('x')),
			y : parseInt(block.getAttribute('y')),
			w : parseInt(block.getAttribute('width')),
			h : parseInt(block.getAttribute('height'))
		}
	}

	this.two = new Two( { width: this.containerEl.offsetWidth, height: this.containerEl.offsetHeight, autostart : true, type : Two.Types.canvas } ).appendTo( this.containerEl );

	// this.letters = this.two.makeGroup();

	// this.letters.translation.set(this.containerEl.offsetWidth / 2 - this.maxx / 2 - 15, this.containerEl.offsetHeight /2 - this.maxy / 2 - 15);

	// for( var i = 0 ; i < blocks.length ; i++ ){
		// if( i == 1 ){
		// 	this.hStripes = new blockScripts.hStripes( this, this.blocks[i] );
		// 	this.letters.add(this.hStripes.group);
		// 	this.hStripes.group.translation.set( this.blocks[i].x + this.blocks[i].w / 2, this.blocks[i].y + this.blocks[i].y / 2 );
		// } else if( i == 2 ){
		// 	this.hStripes2 = new Vstripes( this, this.blocks[i] );
		// 	this.hStripes2.group.translation.set(this.blocks[i].w/2 + 30,this.blocks[i].h/2)
		// } else if( i == 3 ){
		// 	this.solid = new Solid( this, this.blocks[i] );
		// 	this.solid.group.translation.set(this.blocks[i].w/2 + 60,this.blocks[i].h/2)
		// } else if( i == 4 ){
		// 	this.stepGradient = new StepGradient( this, this.blocks[i] );
		// 	this.stepGradient.group.translation.set(this.blocks[i].w/2 + 90,this.blocks[i].h/2)
		// } else if( i == 5 ){
		// 	this.tunel = new Tunel( this, this.blocks[i] );
		// 	this.tunel.group.translation.set(this.blocks[i].w/2 + 120,this.blocks[i].h/2)
		// } else if( i == 6 ){
		// 	this.fiftyFifty = new FiftyFifty( this, this.blocks[i] );
		// 	this.fiftyFifty.group.translation.set(this.blocks[i].w/2 + 120,this.blocks[i].h/2 + 30)
		// } else if( i == 7 ){
		// 	this.layers = new Layers( this, this.blocks[i] );
		// 	this.layers.group.translation.set(this.blocks[i].w/2 + 150,this.blocks[i].h/2 + 30)
		// } else if( i == 8 ){
		// 	this.offset = new Offset( this, this.blocks[i] );
		// 	this.offset.group.translation.set(this.blocks[i].w/2 + 180,this.blocks[i].h/2 + 30)
		// } else if( i == 9 ){
		// 	this.checkers = new Checkers( this, this.blocks[i] );
		// 	this.checkers.group.translation.set(this.blocks[i].w/2 + 300,this.blocks[i].h/2 + 30)
		// } else if( i == 10 ){
		// 	this.switch = new Switch( this, this.blocks[i] );
		// 	this.switch.group.translation.set(this.blocks[i].w/2 + 300,this.blocks[i].h/2 + 0)
		// }  else {
		// 	var empty = new Empty( this, this.blocks[i] );
		// 	this.letters.add( empty.group );
		// }
	// }

	var count = 0;
	this.hBlocks = [];
	for (var key in blockScripts) {
		this.hBlocks[count] = new blockScripts[key]( this, { w : 90, h : 30, x : 30, y : 30 + 30 * count } );
		this.hBlocks[count].group.translation.set( 75, 45 + 60 * count );
		// setInterval( function(){ this.wBlocks[count].animate( ); }.bind(this), 3000 );
		count++;
	}

	var count = 0;
	this.wBlocks = [];
	for (var key in blockScripts) {
		this.wBlocks[count] = new blockScripts[key]( this, { w : 30, h : 90, x : 30, y : 30 + 30 * count } );
		this.wBlocks[count].group.translation.set( 180 + 60 * count, 75 );
		count++;
	}

	this.firstResize = true;
	window.onresize = this.onResize.bind( this );

	this.step();
}

App.prototype.onResize = function(e) {
	this.grid.resize();
	clearTimeout( this.resizeStart );
	if( !this.firstResize ) this.resizeStart = setTimeout( this.onResizeEnd.bind(this), 400 );
	this.firstResize = false;
}

App.prototype.onResizeEnd = function(e) {

}

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	for( i = 0 ; i < this.wBlocks.length ; i++ ){
		this.hBlocks[i].step();
		this.wBlocks[i].step();
	}
};

var app = new App();