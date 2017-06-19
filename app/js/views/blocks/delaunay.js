var triangulate = require('delaunay-triangulate');

var Delaunay = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name  = 'Delaunay';

	this.totalPoints = parseInt( this.block.w / this.parent.parent.parent.moduleSize + this.block.h / this.parent.parent.parent.moduleSize ) / 2;

	var rect = this.parent.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.fill = '#ffffff';

	this.group = this.parent.parent.parent.two.makeGroup( rect );

	this.triangulate();
}

Delaunay.prototype.triangulate = function( ){
	if( this.tris ) this.group.remove( this.tris );

	this.tris = this.parent.parent.parent.two.makeGroup( );

	this.points = [];

	this.points.push( [ 0, 0 ], [ this.block.w, 0 ], [ 0, this.block.h ], [ this.block.w, this.block.h ] );

	for( var i = 0 ; i < this.totalPoints * 2 ; i++ ) this.points.push( [ Math.random() * (this.block.w) , 0 ], [ Math.random() * ( this.block.w) , this.block.h ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) this.points.push( [ 0 , Math.random() * (this.block.h) ], [ (this.block.w) , Math.random() * (this.block.h) ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) this.points.push( [ Math.random() * (this.block.w) , Math.random() * (this.block.h) ] );

	for( var i = 0 ; i < this.points.length ; i++ ){
		this.points[i][0] += this.block.x;
		this.points[i][1] += this.block.y;
	}
	
	this.triangles = triangulate( this.points );

	for( var i = 0 ; i < this.triangles.length ; i++ ){
		var tris = this.parent.parent.parent.two.makePath(
			this.points[ this.triangles[i][0] ][0] , this.points[ this.triangles[i][0] ][1],
			this.points[ this.triangles[i][1] ][0] , this.points[ this.triangles[i][1] ][1],
			this.points[ this.triangles[i][2] ][0] , this.points[ this.triangles[i][2] ][1],
			false
		);
		tris.noFill();
		tris.linewidth = this.parent.lineWidth * 0.4;
		this.tris.add( tris );
	}
	this.group.add( this.tris );
}


Delaunay.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){

	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#ffffff', '#000000').restore();

	var ps = [];


	var points = [32, 16, 8, 4, 2, 1];

	ps.push( [ 0, 0 ], [ block.w, 0 ], [ 0, block.h ], [ block.w, block.h ] );

	for( var i = 0 ; i < this.totalPoints * 2 ; i++ ) ps.push( [ Math.random() * (block.w ) , 0 ], [ Math.random() * ( block.w) , block.h ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) ps.push( [ 0 , Math.random() * (block.h) ], [ (block.w) , Math.random() * (block.h) ] );
	for( var i = 0 ; i < this.totalPoints * points[this.parent.parent.parent.size] ; i++ ) ps.push( [ Math.random() * (block.w) , Math.random() * (block.h) ] );

	for( var i = 0 ; i < ps.length ; i++ ){
		ps[i][0] += block.x;
		ps[i][1] += block.y;
	}
	
	var tris = triangulate( ps );
	
	for( var i = 0 ; i < tris.length ; i++ ) doc.path('M '+ps[ tris[i][0] ][0]+','+ps[ tris[i][0] ][1]+' L '+ps[ tris[i][1] ][0]+','+ps[ tris[i][1] ][1]+' L '+ps[ tris[i][2] ][0]+','+ps[ tris[i][2] ][1] + ' Z' ).lineJoin('round').lineWidth(strokeWidth*0.3).stroke();
	doc.lineJoin('miter');
}

Delaunay.prototype.step = function( time ) {
	if( !this.parent.active ) clearInterval( this.switchInterval );
	if( this.animate && !this.switchInterval ) this.switchInterval = setInterval( this.triangulate.bind(this), 400 );
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );
};

module.exports = Delaunay;