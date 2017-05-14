var Delaunay = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.totalPoints = 50;

	this.group = this.parent.parent.two.makeGroup( );

	this.points = [];

	this.points.push( [ 0, 0 ] );
	this.points.push( [ this.block.w, 0 ] );
	this.points.push( [ 0, this.block.h ] );
	this.points.push( [ this.block.w, this.block.h ] );

	for( var i = 0 ; i < 12 ; i++ ){
		this.points.push( [ Math.random() * this.block.w , 0 ] );
		this.points.push( [ Math.random() * this.block.w , this.block.h ] );
	}
	for( var i = 0 ; i < 6 ; i++ ){
		this.points.push( [ 0 , Math.random() * this.block.h ] );
		this.points.push( [ Math.random() * this.block.w , Math.random() * this.block.h ] );
	}

	for( var i = 0 ; i < this.totalPoints + 10 ; i++ ) this.points.push( [ Math.random() * this.block.w , Math.random() * this.block.h ] );

	for( var i = 0 ; i < this.points.length ; i++ ){
		this.points[i][0] += this.block.x;
		this.points[i][1] += this.block.y;
	}
	var triangles = triangulate( this.points );

	for( var i = 0 ; i < triangles.length ; i++ ){
		var tris = this.parent.parent.two.makePath(
			this.points[ triangles[i][0] ][0] , this.points[ triangles[i][0] ][1],
			this.points[ triangles[i][1] ][0] , this.points[ triangles[i][1] ][1],
			this.points[ triangles[i][2] ][0] , this.points[ triangles[i][2] ][1],
			false
		);
		tris.noFill();
		tris.linewidth = 0.5;
		this.group.add( tris );
	}

}
Delaunay.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Delaunay.prototype.step = function( time ) {
	
};

module.exports = Delaunay;