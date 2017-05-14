var StepGradient = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.props = {
		steps : 10
	}

	this.group = this.parent.parent.two.makeGroup();

	for( var i = 0 ; i < this.props.steps ; i++ ){
		if( this.block.w > this.block.h ){
			var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2 - this.block.w / 2 + ( this.block.w / this.props.steps / 2 ) + ( this.block.w / this.props.steps * i), this.block.y + this.block.h / 2, this.block.w / this.props.steps, this.block.h );
		} else {
			var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2 - this.block.h / 2 + ( this.block.h / this.props.steps / 2	) + ( this.block.h / this.props.steps * i), this.block.w, this.block.h / this.props.steps );
		}
		rect.linewidth = 1;
		var col = parseInt( 255 * 0.1 + 255 * 0.8 * i / this.props.steps );
		rect.fill = 'rgb('+col+','+col+','+col+')';

		this.group.add( rect );
	}
}

StepGradient.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}


StepGradient.prototype.step = function() {

};

module.exports = StepGradient;