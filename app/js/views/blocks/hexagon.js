var BaseTiles = require('./BaseTiles');

var Hexagon = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 1, this.parent.parent.textures.txtrs.hexagon );
}

Hexagon.prototype = Object.create(BaseTiles.prototype);
Hexagon.prototype.constructor = Hexagon;

Hexagon.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = Hexagon;