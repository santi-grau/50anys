var texs = require('./../../media/patterns.svg');

var Textures = function( parent ){
	this.parent = parent;
	this.txtrs = {};
	this.txtrsSvg = {};
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
	var img = new Image();
	img.onload = function () {
		ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(this, 0, 0);     
		_this.txtrs[id] = ctx.canvas.toDataURL();
		var c = 0;
		for(var key in _this.txtrs) {
			c++;
			if( c == totalTexs ) window.dispatchEvent(_this.parent.event);
		}
    };

    img.src = 'data:image/svg+xml,' + '<svg xmlns="http://www.w3.org/2000/svg" width = "512" height = "512" >' + content + '</svg>';
}

module.exports = Textures;