var Empty = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.name = 'Empty';
	this.noAnimate = true;
	
	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.linewidth = this.parent.lineWidth;

	this.group = this.parent.parent.two.makeGroup( this.rect );
}
Empty.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Empty.prototype.export = function( block, snap, scale, strokeWidth, frame ) {
	var r = snap.rect( block.x * scale, block.y * scale, block.w * scale, block.h * scale);
	r.attr({ fill: '#ffffff', stroke: '#000000', strokeWidth: strokeWidth });
};

Empty.prototype.exportPDF = function( block, doc, scale, strokeWidth ){
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#ffffff', '#000000').restore();
}

Empty.prototype.step = function( time ) {
	
};

module.exports = Empty;