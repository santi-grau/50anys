var Ascii = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;
	
	this.name  = 'ASCII';

	this.time = 0;

	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.fill = '#000000';
	this.rect.linewidth = this.parent.lineWidth;

	this.group = this.parent.parent.two.makeGroup( this.rect );

	this.refresh()
}

Ascii.prototype.refresh = function(  ){
	if( this.lines ) this.group.remove( this.lines );
	this.lines = this.parent.parent.two.makeGroup( );

	var lineHeight = Math.min( this.block.w, this.block.h ) / 6;
	var totalLines = this.block.h / lineHeight;

	for( var i = 1 ; i < totalLines ; i++ ){
		var w = (this.parent.parent.simplexNoise.noise2D(0,i + Math.floor( this.time )) + 1) / 2;
		if( w < 0.1 ) w = 0;
		w *= ( this.block.w - lineHeight );
		rect = this.parent.parent.two.makeRectangle( this.block.x + lineHeight / 2 + w / 2, this.block.y + lineHeight * i, w, lineHeight * 0.8 );
		rect.noStroke();
		rect.fill = '#ffffff';
		this.lines.add(rect);
	}

	this.group.add( this.lines );
}

Ascii.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#000000', '#000000').restore();
	
	var bs = [16,14,12,10,8,6];
	var amount = bs[this.parent.parent.size];

	var lineHeight = Math.min( block.w, block.h ) / amount;
	var totalLines = block.h / lineHeight;

	for( var i = 1 ; i < totalLines ; i++ ){
		var w = (this.parent.parent.simplexNoise.noise2D(0,i ) + 1) / 2;
		if( w < 0.1 ) w = 0;
		w *= ( block.w - lineHeight );
		doc.rect( ( block.x + lineHeight / 2 ), ( block.y + lineHeight * i - lineHeight / 2 ), w, lineHeight * 0.7 ).fill("#ffffff");
	}
}

Ascii.prototype.step = function( time ) {
	if( !this.animate ) return;
	this.time += 0.1;
	if( Math.floor( this.time ) !== this.oldTime ) this.refresh();
	this.oldTime = Math.floor( this.time );
};

module.exports = Ascii;