var BaseTiles = require('./BaseTiles');

var Gridlines = function( ) {
	BaseTiles.apply(this, arguments);
	this.create( 1, this.parent.parent.textures.txtrs.grid );

	this.dir = new THREE.Vector2(0,1);
	this.py = 0;
	this.tween = TweenMax.to( this, 0.4, { paused : !this.animate, py : -1, repeat : Infinity, onRepeat: this.onRepeat.bind(this), repeatDelay : 0.5, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

Gridlines.prototype = Object.create(BaseTiles.prototype);
Gridlines.prototype.constructor = Gridlines;

Gridlines.prototype.onRepeat = function(){
	var dir = [
		new THREE.Vector2(0,1),
		new THREE.Vector2(1,0),
		new THREE.Vector2(0,-1),
		new THREE.Vector2(-1,0),
	]
	this.dir = dir[ Math.floor( Math.random( ) * 4 ) ];
	if(!this.animate) this.tween.pause();
	this.py = 0;
}

Gridlines.prototype.step = function( time ) {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2( this.py * this.dir.x, this.py * this.dir.y );
};

module.exports = Gridlines;