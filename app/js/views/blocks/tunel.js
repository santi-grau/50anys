var Tunel = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Tunel';

	this.timeTarget = 0.2;
	if( this.animate ) this.timeInc = this.timeTarget;
	else this.timeInc = 0;
	

	var rect = this.parent.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.fill = '#ffffff';

	this.squares = this.parent.parent.parent.two.makeGroup( );
	this.group = this.parent.parent.parent.two.makeGroup( rect, this.squares );

	var totalSquares = 4;
	for( var i = 0 ; i < totalSquares; i++ ){
		var inc = i/(totalSquares-1);
		this['sq'+i] = [
			new Two.Anchor(this.block.x + Math.min( this.block.w , this.block.h ) / 2 * inc, this.block.y + Math.min( this.block.w , this.block.h ) / 2 * inc ),
			new Two.Anchor(this.block.x + this.block.w - Math.min( this.block.w , this.block.h ) / 2 * inc, this.block.y + Math.min( this.block.w , this.block.h ) / 2 * inc ),
			new Two.Anchor(this.block.x + this.block.w - Math.min( this.block.w , this.block.h ) / 2 * inc, this.block.y + this.block.h - Math.min( this.block.w , this.block.h ) / 2 * inc ),
			new Two.Anchor(this.block.x + Math.min( this.block.w , this.block.h ) / 2 * inc, this.block.y + this.block.h - Math.min( this.block.w , this.block.h ) / 2 * inc )
		];

		var sq = new Two.Path(this['sq'+i], true, false, false);
		sq.noFill();
		sq.linewidth = this.parent.lineWidth / 2;

		this.squares.add( sq );
	}
}

Tunel.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.lineJoin('miter');
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#ffffff', '#000000').restore();
	
	var sq = [6,6,5,5,4,4];
	var totalSquares = sq[this.parent.parent.parent.size];

	

	for( var i = 1 ; i < totalSquares; i++ ){
		var inc = i/(totalSquares-1);
		doc.save().translate( (block.x + Math.min( block.w , block.h ) / 2 * inc), (block.y + Math.min( block.w , block.h ) / 2 * inc) ).rect( 0, 0, (block.x + block.w - Math.min( block.w , block.h ) / 2 * inc) - (block.x + Math.min( block.w , block.h ) / 2 * inc), (block.y + block.h - Math.min( block.w , block.h ) / 2 * inc) - (block.y + Math.min( block.w , block.h ) / 2 * inc) )
			.lineJoin('miter')
			.lineWidth(strokeWidth*0.3)
			.stroke("#000000")
			.restore();
	}
}
Tunel.prototype.step = function() {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	

	for( var i = 0 ; i < this.squares.children.length ; i++ ){
		this['sq'+i][0].x -= this.timeInc;
		this['sq'+i][0].y -= this.timeInc;

		this['sq'+i][1].x += this.timeInc;
		this['sq'+i][1].y -= this.timeInc;

		this['sq'+i][2].x += this.timeInc;
		this['sq'+i][2].y += this.timeInc;

		this['sq'+i][3].x -= this.timeInc;
		this['sq'+i][3].y += this.timeInc;

		if( this['sq'+i][0].x < this.block.x ){
			this['sq'+i][0].x = this.block.x + Math.min( this.block.w , this.block.h ) / 2;
			this['sq'+i][0].y = this.block.y + Math.min( this.block.w , this.block.h ) / 2;

			this['sq'+i][1].x = this.block.x + this.block.w - Math.min( this.block.w , this.block.h ) / 2;
			this['sq'+i][1].y = this.block.y + Math.min( this.block.w , this.block.h ) / 2;

			this['sq'+i][2].x = this.block.x + this.block.w - Math.min( this.block.w , this.block.h ) / 2;
			this['sq'+i][2].y = this.block.y + this.block.h - Math.min( this.block.w , this.block.h ) / 2;

			this['sq'+i][3].x = this.block.x + Math.min( this.block.w , this.block.h ) / 2;
			this['sq'+i][3].y = this.block.y + this.block.h - Math.min( this.block.w , this.block.h ) / 2;
		}
	}
};

module.exports = Tunel;