var BaseTiles = require('./BaseTiles');

var Diagonal2 = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 0.8, this.parent.parent.textures.txtrs.diagonal2, 'diagonal2' );

	this.name = 'Diagonal 1';

	this.px = 0;
	this.tween = TweenMax.to( this, 0.8, { paused : !this.animate, px : -1, repeat : Infinity, onRepeat: this.onRepeat.bind(this), repeatDelay : 0.5, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

Diagonal2.prototype = Object.create(BaseTiles.prototype);
Diagonal2.prototype.constructor = Diagonal2;

Diagonal2.prototype.onRepeat = function(){
	if(!this.animate) this.tween.pause();
	this.px = 0;
}

Diagonal2.prototype.step = function( time ) {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( this.px, -this.px );
};

module.exports = Diagonal2;