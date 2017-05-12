var BaseTiles = require('./BaseTiles');

var tdCubes = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.tdCubes );
}

tdCubes.prototype = Object.create(BaseTiles.prototype);
tdCubes.prototype.constructor = tdCubes;

tdCubes.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,0);
};

module.exports = tdCubes;