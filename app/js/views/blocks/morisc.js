var BaseTiles = require('./BaseTiles');

var Morisc = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.morisc );
}

Morisc.prototype = Object.create(BaseTiles.prototype);
Morisc.prototype.constructor = Morisc;

Morisc.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = Morisc;