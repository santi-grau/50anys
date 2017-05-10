var Checkers = function( parent, block ) {
	this.parent = parent;

	this.time = 0;

	this.props = {
		amount : 10,
		timeInc : 0,
		maxTimeInc : 0.5,
		moveInv : false,
		moveVertical : false
	}

	this.size = Math.min(block.w, block.h) / this.props.amount;

	this.squares = this.parent.two.makeGroup();
	this.group = this.parent.two.makeGroup( this.squares );

	for( var i = -2 ; i < block.w / this.size + 2; i+=2 ){
		for( var j = -2 ; j < block.h / this.size + 2; j++ ){
			var px = -block.w / 2 + this.size / 2 + i * this.size;
			var py;
			if(j%2 == 0) px += 0;
			else px += this.size;
			py = -block.h / 2 + this.size / 2 + j * this.size;
			var rect = this.parent.two.makeRectangle( px, py, this.size, this.size );
			rect.ox = px;
			rect.oy = py;
			rect.fill = '#000000';
			rect.noStroke();
			this.squares.add( rect );
		}
	}

	var rect = this.parent.two.makeRectangle( 0, 0, block.w, block.h );
	this.squares.mask = rect;
	this.group.add( rect );
}

Checkers.prototype.animate = function( val ){
	if( val ) TweenMax.to(this.props, 1, {  timeInc: this.props.maxTimeInc, ease: Circ.easeIn } );
	else TweenMax.to(this.props, 2, {  timeInc: 0, ease: Power4.easeOut } );
}

Checkers.prototype.step = function() {

	if( this.time < this.size * 2 ) this.time += this.props.timeInc;
	else this.time = 0;

	for( var i = 0 ; i < this.squares.children.length ; i++ ) this.squares.children[i].translation.set( this.squares.children[i].ox + ( ( this.props.moveInv ) ? -1 : 1 ) * ( ( this.props.moveVertical ) ? 0 : 1 ) * this.time, this.squares.children[i].oy + ( ( this.props.moveInv ) ? -1 : 1 ) * ( ( this.props.moveVertical ) ? 1 : 0 ) * this.time );

};

module.exports = Checkers;