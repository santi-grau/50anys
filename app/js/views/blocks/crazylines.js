var BaseTiles = require('./BaseTiles');

var CrazyLines = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 0.5, this.parent.parent.textures.txtrs.crazylines );
}

CrazyLines.prototype = Object.create(BaseTiles.prototype);
CrazyLines.prototype.constructor = CrazyLines;

CrazyLines.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = CrazyLines;