var Layers = function( parent, block ) {
	this.parent = parent;

	this.props = {
		amount : 4
	}

	this.group = this.parent.two.makeGroup();

	for( var i = 0 ; i < this.props.amount; i++ ){
		var rect = this.parent.two.makeRectangle(i * 4, -i * 4, block.w, block.h );
		rect.linewidth = 1;
		rect.noFill();
		rect.fill = '#ffffff';
		this.group.add( rect );
	}
	
	

	

	
}

Layers.prototype.step = function() {

};

module.exports = Layers;