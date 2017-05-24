var BaseTiles = require('./BaseTiles');

var TinyDots = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 2, this.parent.parent.textures.txtrs.tinyDots );

	this.px = 0;
	this.tween = TweenMax.to( this, 0.4, { paused : !this.animate, px : -1, repeat : Infinity, onRepeat: this.onRepeat.bind(this), repeatDelay : 0.5, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

TinyDots.prototype = Object.create(BaseTiles.prototype);
TinyDots.prototype.constructor = TinyDots;

TinyDots.prototype.onRepeat = function(){
	if(!this.animate) this.tween.pause();
	this.px = 0;
}

TinyDots.prototype.step = function( time ) {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( this.px, 0 );
};

module.exports = TinyDots;