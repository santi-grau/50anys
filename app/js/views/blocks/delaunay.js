var triangulate = require('delaunay-triangulate');

var Delaunay = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name  = 'Delaunay';

	this.totalPoints = 10;

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.noFill();

	this.group = this.parent.parent.two.makeGroup( rect );

	this.triangulate();
}

Delaunay.prototype.triangulate = function( ){
	if( this.tris ) this.group.remove( this.tris );

	this.tris = this.parent.parent.two.makeGroup( );

	this.points = [];

	this.points.push( [ 2, 2 ], [ this.block.w - 2, 2 ], [ 2, this.block.h - 2 ], [ this.block.w - 2, this.block.h - 2 ] );

	for( var i = 0 ; i < 12 ; i++ ){
		this.points.push( [ 2 + Math.random() * (this.block.w - 4) , 2 ], [ 2 + Math.random() * ( this.block.w -4) , this.block.h -2 ] );
	}
	for( var i = 0 ; i < 6 ; i++ ){
		this.points.push( [ 2 , 2 + Math.random() * (this.block.h-4) ], [ (this.block.w-2) , 2 + Math.random() * (this.block.h-4) ] );
	}

	for( var i = 0 ; i < this.totalPoints ; i++ ) this.points.push( [ 2 + Math.random() * (this.block.w-4) , 2 + Math.random() * (this.block.h-4) ] );

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
		tris.linewidth = 1.5;
		this.tris.add( tris );
	}
	this.group.add( this.tris );
}

Delaunay.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Delaunay.prototype.step = function( time ) {
	if( this.animate && !this.switchInterval ) this.switchInterval = setInterval( this.triangulate.bind(this), 100 );
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );
};

module.exports = Delaunay;