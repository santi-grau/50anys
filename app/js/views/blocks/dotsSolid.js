var BaseTiles = require('./BaseTiles');

var DotsSolid = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 3, this.parent.parent.textures.txtrs.dotsSolid );
}

DotsSolid.prototype = Object.create(BaseTiles.prototype);
DotsSolid.prototype.constructor = DotsSolid;

DotsSolid.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = DotsSolid;