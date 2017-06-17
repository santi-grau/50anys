window.THREE = require('three');
var Download = require('./views/download');
window.TweenMax = require('gsap');
window.BezierEasing = require('bezier-easing');
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

var Export = function(){
	var hash = document.URL.substr(document.URL.indexOf('#')+1).split('/');
	this.id = hash[0];
	this.size = hash[1];

	this.moduleSize = 35;
	this.blockScripts = blockScripts;
	this.two = new Two( { autostart : true, type : Two.Types.canvas } );

	this.containerEl = document.getElementById('main');
	this.containerOne = document.getElementById('one');
	this.containerTwo = document.getElementById('two');
	this.containerThree = document.getElementById('three');
	this.scene = new THREE.Scene();

	this.seed = Math.random;
	this.simplexNoise = new SimplexNoise( this.seed );
	
	this.event = new Event('textures');
	// window.addEventListener('textures', function(){ this.onReady('textures') }.bind(this), false);

	this.textures = new Textures( this );

	var _this = this;
	var oReq = new XMLHttpRequest();
	oReq.addEventListener('load', function(data){
		new Download( _this, JSON.parse( data.currentTarget.responseText ), _this.id );
	});
	oReq.open('GET', 'https://s3.eu-central-1.amazonaws.com/eina50/' + this.id + '.json');
	oReq.send();
}

new Export();