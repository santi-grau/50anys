var NoisePattern = function( parent, block ) {
	this.parent = parent;

	this.time = 0;

	this.stripes = this.parent.two.makeGroup();
	this.group = this.parent.two.makeGroup( this.stripes );

	this.props = {
		def : 3,
		timeInc : 3,
		maxTimeInc : 0.3
	}

	for( var i = 0 ; i < block.h ; i+= this.props.def ){
		var line = this.parent.two.makeLine( -block.w/2, i - block.h / 2, block.w/2 , i - block.h / 2 );	
		line.linewidth = this.props.def;
		line.p = i - block.h / 2;
		this.stripes.add( line );
	}
	
	var rect = this.parent.two.makeRectangle( block.x, block.y, block.w, block.h );
	rect.translation = { x : 0, y : 0 };	
	this.stripes.mask = rect;
	this.group.add( rect );
}

NoisePattern.prototype.animate = function( val ){

}

NoisePattern.prototype.step = function() {
	this.time += this.props.timeInc;
	for( var i = 0 ; i < this.stripes.children.length ; i++ ){
		var n = this.parent.simplexNoise.noise2D( 0, this.stripes.children[i].p + this.time );
		if( n > 0 ) this.stripes.children[i].opacity = 1;
		else this.stripes.children[i].opacity = 0;
	}
};

module.exports = NoisePattern;