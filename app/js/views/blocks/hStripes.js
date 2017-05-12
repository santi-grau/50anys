var BaseTiles = require('./BaseTiles');

var hStripes = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 6, this.parent.parent.textures.txtrs.hStripes );
}

hStripes.prototype = Object.create(BaseTiles.prototype);
hStripes.prototype.constructor = hStripes;

hStripes.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,-time/1000);
};

module.exports = hStripes;