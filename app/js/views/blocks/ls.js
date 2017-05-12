var BaseTiles = require('./BaseTiles');

var Ls = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 1, this.parent.parent.textures.txtrs.ls );
}

Ls.prototype = Object.create(BaseTiles.prototype);
Ls.prototype.constructor = Ls;

Ls.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = Ls;