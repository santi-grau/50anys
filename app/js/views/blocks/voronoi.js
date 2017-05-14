var Voronoi = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.totalPoints = 10;

	this.group = this.parent.parent.two.makeGroup( );

	this.points = [];


	var bbox = {xl: this.block.x, xr: this.block.x + this.block.w, yt: this.block.y, yb: this.block.y + this.block.h};

	for( var i = 0 ; i < this.totalPoints ; i++ ){
		this.points.push( {x: this.block.x + this.block.w * Math.random(), y: this.block.y + this.block.h * Math.random() } )
	}

	var v = new voronoi();

	var diagram = v.compute(this.points, bbox);
	for( var i = 0 ; i < diagram.edges.length ; i++ ){
		var line = new Two.Line(diagram.edges[i].va.x, diagram.edges[i].va.y, diagram.edges[i].vb.x, diagram.edges[i].vb.y);
		this.group.add(line);
	}

}
Voronoi.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Voronoi.prototype.step = function( time ) {
	
};

module.exports = Voronoi;