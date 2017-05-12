var BaseTiles = require('./BaseTiles');

var Hdashes = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 4, this.parent.parent.textures.txtrs.hDashes );
}

Hdashes.prototype = Object.create(BaseTiles.prototype);
Hdashes.prototype.constructor = Hdashes;

Hdashes.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = Hdashes;