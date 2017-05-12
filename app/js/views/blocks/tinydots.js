var BaseTiles = require('./BaseTiles');

var TinyDots = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 4, this.parent.parent.textures.txtrs.tinydots );
}

TinyDots.prototype = Object.create(BaseTiles.prototype);
TinyDots.prototype.constructor = TinyDots;

TinyDots.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(time/1000,0);
};

module.exports = TinyDots;