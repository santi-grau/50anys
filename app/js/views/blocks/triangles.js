var BaseTiles = require('./BaseTiles');

var Triangles = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 6, this.parent.parent.textures.txtrs.triangles );
}

Triangles.prototype = Object.create(BaseTiles.prototype);
Triangles.prototype.constructor = Triangles;

Triangles.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = Triangles;