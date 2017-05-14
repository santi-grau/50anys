var Layers = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.props = {
		amount : 4
	}

	this.group = this.parent.parent.two.makeGroup();

	for( var i = 0 ; i < this.props.amount; i++ ){
		var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2 + i * 2, this.block.y + this.block.h / 2 -i * 2, block.w, block.h );
		rect.linewidth = 1;
		rect.noFill();
		rect.fill = '#ffffff';
		this.group.add( rect );
	}
	
}

Layers.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}


Layers.prototype.step = function() {

};

module.exports = Layers;