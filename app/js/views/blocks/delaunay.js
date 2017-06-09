var triangulate = require('delaunay-triangulate');

var Delaunay = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name  = 'Delaunay';

	this.totalPoints = parseInt( this.block.w / this.parent.parent.moduleSize + this.block.h / this.parent.parent.moduleSize ) / 2;

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

	for( var i = 0 ; i < this.totalPoints * 2 ; i++ ) this.points.push( [ 2 + Math.random() * (this.block.w - 4) , 2 ], [ 2 + Math.random() * ( this.block.w -4) , this.block.h -2 ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) this.points.push( [ 2 , 2 + Math.random() * (this.block.h-4) ], [ (this.block.w-2) , 2 + Math.random() * (this.block.h-4) ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) this.points.push( [ 2 + Math.random() * (this.block.w-4) , 2 + Math.random() * (this.block.h-4) ] );

	for( var i = 0 ; i < this.points.length ; i++ ){
		this.points[i][0] += this.block.x;
		this.points[i][1] += this.block.y;
	}
	
	this.triangles = triangulate( this.points );

	for( var i = 0 ; i < this.triangles.length ; i++ ){
		var tris = this.parent.parent.two.makePath(
			this.points[ this.triangles[i][0] ][0] , this.points[ this.triangles[i][0] ][1],
			this.points[ this.triangles[i][1] ][0] , this.points[ this.triangles[i][1] ][1],
			this.points[ this.triangles[i][2] ][0] , this.points[ this.triangles[i][2] ][1],
			false
		);
		tris.noFill();
		tris.linewidth = 1.5;
		this.tris.add( tris );
	}
	this.group.add( this.tris );
}

Delaunay.prototype.export = function( block, snap, scale, strokeWidth, frame ){

	var r = snap.rect( block.x * scale, block.y * scale, block.w * scale, block.h * scale);
	r.attr({ fill: '#ffffff', stroke: '#000000', strokeWidth: strokeWidth });
	
	for( var i = 0 ; i < this.triangles.length ; i++ ){
		var points = [];
		points.push(
			this.points[ this.triangles[i][0] ][0] , this.points[ this.triangles[i][0] ][1],
			this.points[ this.triangles[i][1] ][0] , this.points[ this.triangles[i][1] ][1],
			this.points[ this.triangles[i][2] ][0] , this.points[ this.triangles[i][2] ][1]
		);
		var poly = snap.polyline(points);
		poly.attr({ fill: 'none', stroke: '#000000', strokeWidth: strokeWidth / 2 });
	}
}

Delaunay.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#ffffff', '#000000').restore();

	var ps = [];

	ps.push( [ 2, 2 ], [ block.w - 2, 2 ], [ 2, block.h - 2 ], [ block.w - 2, block.h - 2 ] );

	for( var i = 0 ; i < this.totalPoints * 2 ; i++ ) ps.push( [ 2 + Math.random() * (block.w - 4) , 2 ], [ 2 + Math.random() * ( block.w -4) , block.h -2 ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) ps.push( [ 2 , 2 + Math.random() * (block.h-4) ], [ (block.w-2) , 2 + Math.random() * (block.h-4) ] );
	for( var i = 0 ; i < this.totalPoints ; i++ ) ps.push( [ 2 + Math.random() * (block.w-4) , 2 + Math.random() * (block.h-4) ] );

	for( var i = 0 ; i < ps.length ; i++ ){
		ps[i][0] += block.x;
		ps[i][1] += block.y;
	}
	
	var tris = triangulate( ps );
	
	for( var i = 0 ; i < tris.length ; i++ ) doc.path('M '+ps[ tris[i][0] ][0]+','+ps[ tris[i][0] ][1]+' L '+ps[ tris[i][1] ][0]+','+ps[ tris[i][1] ][1]+' L '+ps[ tris[i][2] ][0]+','+ps[ tris[i][2] ][1] + ' Z' ).lineJoin('round').lineWidth(strokeWidth*0.3).stroke();
}

Delaunay.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Delaunay.prototype.step = function( time ) {
	if( this.animate && !this.switchInterval ) this.switchInterval = setInterval( this.triangulate.bind(this), 100 );
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );
};

module.exports = Delaunay;