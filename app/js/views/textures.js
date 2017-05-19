var texs = require('./../../media/patterns.svg');

var Textures = function( parent ){
	this.parent = parent;
	this.txtrs = {};
	var textures = new DOMParser().parseFromString(texs, "image/svg+xml");
	var layers = textures.getElementsByTagName('g');
	var totalTexs = layers.length;
	var viewBox = textures.getElementsByTagName('svg')[0].getAttribute('viewBox').split(' ');
	var canvas = document.createElement('canvas');
	canvas.width  = viewBox[2];
	canvas.height = viewBox[3];
	var ctx = canvas.getContext('2d');
	for( var i = 0 ; i < layers.length ; i++ ) this.makeCanvas(layers[i].getAttribute('id'), layers[i].innerHTML, ctx, totalTexs );
}

Textures.prototype.makeCanvas = function( id, content, ctx, totalTexs ){
	var _this = this;
	var svg = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" >' + content + '</svg>'], {type:"image/svg+xml;charset=utf-8"});
	var domURL = self.URL || self.webkitURL || self;
	var url = domURL.createObjectURL(svg);
	var img = new Image;

	img.onload = function () {
		ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(this, 0, 0);     
		domURL.revokeObjectURL(url);
		_this.txtrs[id] = ctx.canvas.toDataURL();
		var c = 0;
		for(var key in _this.txtrs) {
			c++;
			if( c == totalTexs ) window.dispatchEvent(_this.parent.event);;
		}
    };
    img.src = url;
}

module.exports = Textures;