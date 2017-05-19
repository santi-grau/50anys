var Ascii = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;

	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.fill = '#000000';
	this.rect.noStroke();

	this.group = this.parent.parent.two.makeGroup( this.rect );

	var lineHeight = Math.min( this.block.w, this.block.h ) / 6;
	
	var totalLines = this.block.h / lineHeight;

	for( var i = 1 ; i < totalLines ; i++ ){
		var w = (this.parent.parent.simplexNoise.noise2D(0,i) + 1) / 2;
		if( w < 0.1 ) w = 0;
		w *= ( this.block.w - lineHeight );

		rect = this.parent.parent.two.makeRectangle( this.block.x + lineHeight / 2 + w / 2, this.block.y + lineHeight * i, w, lineHeight * 0.8 );
		rect.noStroke();
		rect.fill = '#ffffff';

		this.group.add(rect);
	}
}

Ascii.prototype.mouseEnter = function(){
	for( var i = 0 ; i < this.group.children.length ; i++ ){
		this.group.children[i].fill = '#2f6fff';
	}
	this.rect.fill = '#1004a4';
}

Ascii.prototype.mouseLeave = function(){
	for( var i = 0 ; i < this.group.children.length ; i++ ){
		this.group.children[i].fill = '#ffffff';
	}
	this.rect.fill = '#000000';
}

Ascii.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Ascii.prototype.step = function( time ) {
	
};

module.exports = Ascii;