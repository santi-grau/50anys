var BaseTiles = require('./BaseTiles');

var CrissCross = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 6, this.parent.parent.textures.txtrs.crissCross );
}

CrissCross.prototype = Object.create(BaseTiles.prototype);
CrissCross.prototype.constructor = CrissCross;

CrissCross.prototype.step = function( time ) {
	if( !this.animate ) return;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0.2,0);
};

module.exports = CrissCross;