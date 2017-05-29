var Bigx = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name  = 'Big X';

	this.switch = false;

	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );

	this.line1 = this.parent.parent.two.makeLine( this.block.x, this.block.y, this.block.x + this.block.w, this.block.y + this.block.h );
	this.line2 = this.parent.parent.two.makeLine( this.block.x + this.block.w, this.block.y, this.block.x, this.block.y + this.block.h );
	this.line1.linewidth = 2;
	this.line2.linewidth = 2;
	
	this.rectStroke = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rectStroke.linewidth = this.parent.lineWidth;
	this.rectStroke.noFill();

	this.group = this.parent.parent.two.makeGroup( this.rect, this.line1, this.line2, this.rectStroke );
}
Bigx.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Bigx.prototype.switchColor = function(){
	this.switch = !this.switch;
	if( this.switch ){
		this.rect.fill = '#000000';
		this.line1.stroke = '#ffffff';
		this.line2.stroke = '#ffffff';
	} else {
		this.rect.fill = '#ffffff';
		this.line1.stroke = '#000000';
		this.line2.stroke = '#000000';
	}
}

Bigx.prototype.step = function( time ) {
	if( this.animate && !this.switchInterval ) this.switchInterval = setInterval( this.switchColor.bind(this), 50 );
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );
};

module.exports = Bigx;