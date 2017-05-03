var svgBlocks = require('./../media/blocks.svg');
var Grid = require('./views/grid');

var Empty = require('./views/blocks/empty');
var Hstripes = require('./views/blocks/hStripes');
var Vstripes = require('./views/blocks/vStripes');
var Solid = require('./views/blocks/solid');
var StepGradient = require('./views/blocks/stepGradient');

var App = function() {
	
	this.containerEl = document.getElementById('main');

	this.blocks = [];	
	this.grid = new Grid( 30 );

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


	this.letters = this.two.makeGroup();
	this.letters2 = this.two.makeGroup();
	this.letters3 = this.two.makeGroup();

	this.letters.translation.set(this.containerEl.offsetWidth / 2 - this.maxx / 2 - 15, this.containerEl.offsetHeight /2 - this.maxy / 2 - 15);

	for( var i = 0 ; i < blocks.length ; i++ ){
		if( i == 1 ){
			this.hStripes = new Hstripes( this, this.blocks[i] );
			this.hStripes.group.translation.set(this.blocks[i].w/2,this.blocks[i].h/2)
		} else if( i == 2 ){
			this.hStripes2 = new Vstripes( this, this.blocks[i] );
			this.hStripes2.group.translation.set(this.blocks[i].w/2 + 30,this.blocks[i].h/2)
		} else if( i == 3 ){
			this.solid = new Solid( this, this.blocks[i] );
			this.solid.group.translation.set(this.blocks[i].w/2 + 60,this.blocks[i].h/2)
		} else if( i == 4 ){
			this.stepGradient = new StepGradient( this, this.blocks[i] );
			this.stepGradient.group.translation.set(this.blocks[i].w/2 + 90,this.blocks[i].h/2)
		} else {
			var empty = new Empty( this, this.blocks[i] );
			this.letters.add( empty.group );
		}
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
	this.hStripes.step();
	this.hStripes2.step();
	// this.vStripes.step();
};

var app = new App();