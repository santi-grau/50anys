var BaseTiles = require('./BaseTiles');

var Arrows = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 0.5, this.parent.parent.parent.textures.txtrs.arrows, 'arrows' );

	this.name  = 'Arrows';

	this.time = 0;
	this.timeInc = 0;
	this.timeTarget = 0.01;

	this.animateDir = new THREE.Vector2( -(this.block.w >= this.block.h), (this.block.w < this.block.h) );
}

Arrows.prototype = Object.create(BaseTiles.prototype);
Arrows.prototype.constructor = Arrows;

Arrows.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( this.time * this.animateDir.x, this.time * this.animateDir.y );
};

module.exports = Arrows;