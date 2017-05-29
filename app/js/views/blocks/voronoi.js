var voronoi = require('voronoi');

var Voronoi = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Voronoi';

	this.totalPoints = 2 * this.block.w / Math.min( this.block.w, this.block.h ) * this.block.h / Math.min( this.block.w, this.block.h );

	this.time = 0;
	this.timeInc = 0;
	this.timeTarget = 0.01;

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.noFill();

	this.group = this.parent.parent.two.makeGroup( rect );

	this.points = [];

	this.bbox = { xl: this.block.x, xr: this.block.x + this.block.w, yt: this.block.y, yb: this.block.y + this.block.h };

	for( var i = 0 ; i < this.totalPoints ; i++ ) this.points.push( { x: this.block.x + this.block.w * Math.random(), y: this.block.y + this.block.h * Math.random() } );

	this.countFrame = 0;
	
}
Voronoi.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Voronoi.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;

	this.countFrame++;
	if( this.countFrame == 2 ) this.countFrame = 0;
	else return;
	

	if( this.block.h > this.block.w ){
		this.points[0].x = this.block.x + this.block.w / 2 + this.block.w * this.parent.parent.simplexNoise.noise2D( 0.5, 0.5 + this.time );
		this.points[0].y = this.block.y + this.block.h / 2 + this.block.h / 2 * Math.sin( this.time );
	} else {
		this.points[0].x = this.block.x + this.block.w / 2 + this.block.w / 2 * Math.sin( this.time );
		this.points[0].y = this.block.y + this.block.h / 2 + this.block.h * this.parent.parent.simplexNoise.noise2D( 0.5, 0.5 + this.time );
	}

	this.group.remove( this.lines );

	this.lines = this.parent.parent.two.makeGroup( );

	var diagram = new voronoi().compute(this.points, this.bbox);
	for( var i = 0 ; i < diagram.edges.length ; i++ ){
		var line = this.parent.parent.two.makeLine(diagram.edges[i].va.x, diagram.edges[i].va.y, diagram.edges[i].vb.x, diagram.edges[i].vb.y);
		line.linewidth = 2;
		this.lines.add( line );
	}
	this.group.add( this.lines );
	
};

module.exports = Voronoi;