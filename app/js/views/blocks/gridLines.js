var BaseTiles = require('./BaseTiles');

var GridLines = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 6, this.parent.parent.textures.txtrs.gridLines );
}

GridLines.prototype = Object.create(BaseTiles.prototype);
GridLines.prototype.constructor = GridLines;

GridLines.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = GridLines;