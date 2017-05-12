var BaseTiles = require('./BaseTiles');

var Plus = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.plus );
}

Plus.prototype = Object.create(BaseTiles.prototype);
Plus.prototype.constructor = Plus;

Plus.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = Plus;