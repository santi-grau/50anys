var BaseTiles = require('./BaseTiles');

var TrisTras = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.trisTras );
}

TrisTras.prototype = Object.create(BaseTiles.prototype);
TrisTras.prototype.constructor = TrisTras;

TrisTras.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = TrisTras;