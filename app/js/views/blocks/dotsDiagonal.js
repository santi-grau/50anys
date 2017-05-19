var BaseTiles = require('./BaseTiles');

var DotsDiagonal = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.dotsdiagonal );
}

DotsDiagonal.prototype = Object.create(BaseTiles.prototype);
DotsDiagonal.prototype.constructor = DotsDiagonal;

DotsDiagonal.prototype.step = function( time ) {
	if( !this.animate ) return;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0.5,0);
};

module.exports = DotsDiagonal;