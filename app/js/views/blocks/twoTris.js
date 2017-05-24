var BaseTiles = require('./BaseTiles');

var BigDot = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 1, this.parent.parent.textures.txtrs.bigDot );

	this.time = 0;
	this.timeInc = 0;
	this.timeTarget = 0.03;

	var dir = Math.round(Math.random());
	this.animateDir = new THREE.Vector2( -(this.block.w > this.block.h), (this.block.w < this.block.h) );
	if( this.block.h == this.block.w ) this.animateDir = new THREE.Vector2( -dir, -!dir );
	
}

BigDot.prototype = Object.create(BaseTiles.prototype);
BigDot.prototype.constructor = BigDot;

BigDot.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( this.time * this.animateDir.x, this.time * this.animateDir.y );
};

module.exports = BigDot;