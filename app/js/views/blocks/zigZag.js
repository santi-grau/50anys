var BaseTiles = require('./BaseTiles');

var Zigzag = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 3, this.parent.parent.textures.txtrs.zigzag );
}

Zigzag.prototype = Object.create(BaseTiles.prototype);
Zigzag.prototype.constructor = Zigzag;

Zigzag.prototype.step = function( time ) {
	if( !this.animate ) return;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,-time/1000);
};

module.exports = Zigzag;