var BaseTiles = require('./BaseTiles');

var hDashes = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 1, this.parent.parent.textures.txtrs.hDashes );

	this.py = 0;
	this.tween = TweenMax.to( this, 0.4, { paused : !this.animate, py : -1, repeat : Infinity, onRepeat: this.onRepeat.bind(this), repeatDelay : 0.5, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

hDashes.prototype = Object.create(BaseTiles.prototype);
hDashes.prototype.constructor = hDashes;

hDashes.prototype.onRepeat = function(){
	if(!this.animate) this.tween.pause();
	this.py = 0;
}

hDashes.prototype.step = function( time ) {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( 0, this.py );
};

module.exports = hDashes;