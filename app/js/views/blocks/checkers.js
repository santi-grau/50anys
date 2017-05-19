var BaseTiles = require('./BaseTiles');

var Checkers = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 3, this.parent.parent.textures.txtrs.checkers );
}

Checkers.prototype = Object.create(BaseTiles.prototype);
Checkers.prototype.constructor = Checkers;

Checkers.prototype.step = function( time ) {
	if( !this.animate ) return;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(0,time/1000);
};



module.exports = Checkers;