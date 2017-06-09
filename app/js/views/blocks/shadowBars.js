var ShadowBars = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Shadow Bars';

	this.lines = this.parent.parent.two.makeGroup( );
	this.group = this.parent.parent.two.makeGroup( this.lines );

	this.countInc = 0.9;

	for( var i = 0 ; i < Math.max( this.block.h, this.block.w ) ; i+=5 ){
		var line;
		if( this.block.h > this.block.w ) line = this.parent.parent.two.makeLine( this.block.x, this.block.y + this.block.h - i, this.block.x + this.block.w * this.countInc, this.block.y + this.block.h - i );
		else line = this.parent.parent.two.makeLine( this.block.x + i, this.block.y + this.block.h, this.block.x + i, this.block.y + this.block.h - this.block.h * this.countInc );
		
		line.l = this.countInc;
		line.linewidth = 2;
		this.countInc *= 0.9;
		this.lines.add(line);
	}

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.noFill();

	this.group.add(rect);

	this.px = 1;

}

ShadowBars.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#ffffff', '#000000').restore();
	var countInc = 0.9;

	for( var i = 0 ; i < Math.max( block.h, block.w ) ; i+=5 ){
		if( block.h > block.w ) doc.save().moveTo( block.x, block.y + block.h - i ).lineTo( block.x + block.w * countInc, block.y + block.h - i ).lineWidth(strokeWidth*0.5).stroke('#000000').restore();
		else doc.save().moveTo( block.x + i, block.y + block.h ).lineTo( block.x + i, block.y + block.h - block.h * countInc ).lineWidth(strokeWidth*0.5).stroke('#000000').restore();
		countInc *= 0.9;
	}
}

ShadowBars.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

ShadowBars.prototype.switchBars = function(){
	this.tween = TweenMax.to( this, 0.6, { px : 1 - this.px, ease : Elastic.easeOut.config(1, 1) } );
}

ShadowBars.prototype.step = function( time ) {
	if( this.animate && !this.switchInterval ) this.switchInterval = setInterval( this.switchBars.bind(this), 1000 );
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );
	
	for( var i = 0 ; i < this.lines.children.length ; i++ ){
		if( this.block.h > this.block.w ) this.lines.children[i].vertices[1].x = this.lines.children[i].vertices[0].x + this.px * this.lines.children[i].l * this.block.w ;
		else this.lines.children[i].vertices[1].y = this.lines.children[i].vertices[0].y - this.px * this.lines.children[i].l * this.block.h ;
	}
};

module.exports = ShadowBars;