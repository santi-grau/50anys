var BaseTiles = require('./BaseTiles');

var vStripes = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 6, this.parent.parent.textures.txtrs.vStripes );
}

vStripes.prototype = Object.create(BaseTiles.prototype);
vStripes.prototype.constructor = vStripes;

vStripes.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(-time/1000,0);
};

module.exports = vStripes;