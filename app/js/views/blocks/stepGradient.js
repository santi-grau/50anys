var StepGradient = function( parent, block ) {
	this.parent = parent;

	this.props = {
		steps : 5
	}

	this.group = this.parent.two.makeGroup();

	for( var i = 0 ; i < this.props.steps ; i++ ){
		if( block.w > block.h ){
			// var rect = this.parent.two.makeRectangle( 0 - block.w / 2 + ( block.w / this.props.steps / 2	) + ( block.w / this.props.steps * i), 0, block.w, block.h / this.props.steps );
		} else {
			var rect = this.parent.two.makeRectangle( 0, - block.h / 2 + ( block.h / this.props.steps / 2	) + ( block.h / this.props.steps * i), block.w, block.h / this.props.steps );
		}
		rect.linewidth = 1;
		var col = parseInt( 255 * 0.1 + 255 * 0.8 * i / this.props.steps );
		rect.fill = 'rgb('+col+','+col+','+col+')';

		this.group.add( rect );
	}
	
}

module.exports = StepGradient;