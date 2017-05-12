var BaseTiles = require('./BaseTiles');

var DotsHollow = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.dotsHollow );
}

DotsHollow.prototype = Object.create(BaseTiles.prototype);
DotsHollow.prototype.constructor = DotsHollow;

DotsHollow.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = DotsHollow;