var BaseTiles = require('./BaseTiles');

var Sprinkles = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 3, this.parent.parent.textures.txtrs.zigzag );

	this.time = 0;
	this.timeInc = 0;
	this.timeTarget = 0.02;
}

Sprinkles.prototype = Object.create(BaseTiles.prototype);
Sprinkles.prototype.constructor = Sprinkles;

Sprinkles.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( 0, -this.time );
};

module.exports = Sprinkles;