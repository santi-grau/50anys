var Loading = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	
	this.rect = this.parent.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );

	var value = Math.random() * 0xFF | 0;
	var grayscale = (value << 16) | (value << 8) | value;
	var color = '#' + grayscale.toString(16);
	
	// this.rect.fill = 'none'
	this.rect.fill = color;
	this.rect.linewidth = 2;

	this.group = this.parent.parent.parent.two.makeGroup( this.rect );
}

module.exports = Loading;