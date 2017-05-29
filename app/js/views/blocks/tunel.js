var Tunel = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Tunel';

	this.timeTarget = 0.2;
	if( this.animate ) this.timeInc = this.timeTarget;
	else this.timeInc = 0;
	

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.fill = '#ffffff';

	this.squares = this.parent.parent.two.makeGroup( );
	this.group = this.parent.parent.two.makeGroup( rect, this.squares );

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
		sq.linewidth = 2;

		this.squares.add( sq );
	}
	
}

Tunel.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
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