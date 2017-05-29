var BaseTiles = require('./BaseTiles');

var CrissCross = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 0.8, this.parent.parent.textures.txtrs.crisscross );

	this.name  = 'Criss Cross';

	this.dir = new THREE.Vector2(0,1);
	this.px = 0;
	this.tween = TweenMax.to( this, 0.8, { paused : !this.animate, px : -1, repeat : Infinity, onRepeat: this.onRepeat.bind(this), repeatDelay : 0.5, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

CrissCross.prototype = Object.create(BaseTiles.prototype);
CrissCross.prototype.constructor = CrissCross;

CrissCross.prototype.onRepeat = function(){

	var dir = [
		new THREE.Vector2(1,1),
		new THREE.Vector2(1,-1),
		new THREE.Vector2(-1,1),
		new THREE.Vector2(-1,-1)
	]
	this.dir = dir[ Math.floor( Math.random( ) * 4 ) ];

	if(!this.animate) this.tween.pause();
	this.px = 0;
}

CrissCross.prototype.step = function( time ) {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( this.px * this.dir.x, this.px * this.dir.y );
};

module.exports = CrissCross;