var Vstripes = function( parent, block ) {
	this.parent = parent;

	this.positions = [];
	this.time = 0;

	this.stripes = this.parent.two.makeGroup();
	this.group = this.parent.two.makeGroup( this.stripes );

	this.props = {
		lineWidth : 5,
		lineGap : 5,
		timeInc : 0.1,
		moveUp : true
	}

	for( var i = -1 ; i < 2 + Math.floor( block.h / Math.floor( this.props.lineWidth + this.props.lineGap ) ) ; i++ ){
		var p = ( this.props.lineWidth + this.props.lineGap ) * i-block.h / 2;
		var line = this.parent.two.makeLine( -block.w/2, p, block.w / 2, p );
		line.oy = p;
		line.linewidth = this.props.lineWidth;
		this.stripes.add( line );
	}

	var rect = this.parent.two.makeRectangle( block.x, block.y, block.w, block.h );
	rect.translation = { x : 0, y : 0 };	
	this.stripes.mask = rect;
	this.group.add( rect );
	
}

Vstripes.prototype.step = function( time ){
	if( this.time < this.props.lineWidth + this.props.lineGap ) this.time += this.props.timeInc;
	else this.time = 0;

	for( var i = 0 ; i < this.stripes.children.length ; i++ ){
		this.stripes.children[i].translation.set( 0, this.stripes.children[i].oy + ( ( this.props.moveUp ) ? -1 : 1 ) * this.time );
	}
}

module.exports = Vstripes;