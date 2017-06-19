var Bars = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name  = 'Bars';

	this.time = Math.random() * 10;
	this.timeInc = 0;
	this.timeTarget = 0.01;
	
	var amount = 4;
	var size = Math.min( this.block.w, this.block.h ) / amount;
	this.squares = this.parent.parent.parent.two.makeGroup( );

	for( var i = 0 ; i < this.block.w; i+= size ){
		for( var j = 0 ; j < this.block.h ; j+= size ){
			var p = { x : this.block.x + i + size / 2, y : this.block.y + j + size / 2 };
			var s = this.parent.parent.parent.two.makeRectangle( p.x, p.y, size, size );
			s.linewidth = 1;
			s.p = p;
			this.squares.add( s );
		}
	}

	this.rect = this.parent.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.linewidth = this.parent.lineWidth;
	this.rect.noFill();

	this.group = this.parent.parent.parent.two.makeGroup( this.squares, this.rect );

	this.shade();
}

Bars.prototype.shade = function( val ){
	for( var i = 0 ; i < this.squares.children.length; i++ ){
		var sq = this.squares.children[i];
		var n = Math.round( ( this.parent.parent.parent.simplexNoise.noise2D( sq.p.x / 100 + this.time, sq.p.y / 100 ) + 1) / 2 );
		this.squares.children[i].fill = 'rgba(' + ( n * 200 + 50 ) + ', ' + ( n * 200 + 50 ) + ', ' + ( n * 200 + 50 ) + ', 1)';
	}
}

Bars.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).fill('#ffffff').restore();
	
	var bs = [14,12,10,8,6,4];
	var amount = bs[this.parent.parent.parent.size];

	var size = Math.min( block.w, block.h ) / amount;

	for( var i = 0 ; i < block.w-1; i+= size ){
		for( var j = 0 ; j < block.h-1 ; j+= size ){
			var n = Math.round( ( this.parent.parent.parent.simplexNoise.noise2D( block.x + i / 100 + this.time, block.y + j / 100 ) + 1) / 2 ) * 200 + 50;
			doc.save().translate( block.x + i , block.y + j  ).rect( 0, 0, size, size ).lineWidth(1).fillAndStroke([n,n,n],'#000000').restore();
		}
	}

	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).stroke('#000000').restore();
}

Bars.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;
	
	this.shade();
	
};

module.exports = Bars;