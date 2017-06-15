var StepGradient = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;
	
	this.name = 'Step Gradient';

	this.steps = 3 * this.block.w / Math.min( this.block.w, this.block.h ) * this.block.h / Math.min( this.block.w, this.block.h )

	this.time = 0;
	this.timeInc = 0;
	this.timeTarget = 0.03;

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.noFill();

	this.rects = this.parent.parent.two.makeGroup();
	this.group = this.parent.parent.two.makeGroup( this.rects, rect );

	for( var i = 0 ; i < this.steps ; i++ ){
		var rect;
		if( this.block.w > this.block.h ) rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2 - this.block.w / 2 + ( this.block.w / this.steps / 2 ) + ( this.block.w / this.steps * i), this.block.y + this.block.h / 2, this.block.w / this.steps, this.block.h );
		else rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2 - this.block.h / 2 + ( this.block.h / this.steps / 2	) + ( this.block.h / this.steps * i), this.block.w, this.block.h / this.steps );

		rect.linewidth = this.parent.lineWidth / 2;
		var col = parseInt( 255 * 0.1 + 255 * 0.8 * i / this.steps );
		rect.fill = 'rgb('+col+','+col+','+col+')';

		this.rects.add( rect );
	}
}

StepGradient.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	var rects = this.rects.children;
	var d = Math.max( block.w, block.h ) / rects.length;
	for( var i = 0 ; i < rects.length ; i++ ){
		var col = rects[i].fill.split(',')[1];
		if( block.w > block.h ) doc.save().translate( block.x + i * d, block.y ).rect( 0, 0, d, block.h ).lineWidth(strokeWidth*0.5).fillAndStroke([ col, col, col ], '#000000').restore();
		else doc.save().translate( block.x, block.y + i * d ).rect( 0, 0, block.w, d ).lineWidth(strokeWidth*0.5).fillAndStroke([ col, col, col ], '#000000').restore();
	}
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).stroke('#000000').restore();
}

StepGradient.prototype.step = function() {
	if( !this.parent.active ) return;

	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;

	var currentSegment = this.steps - Math.floor( ( Math.cos( this.time ) * 0.5 + 0.5 ) * this.steps );
	
	if( currentSegment == this.oldSegment ) return;

	for( var i = 0 ; i < currentSegment; i++ ){
		var col = parseInt( 255 * 0.9 - 255 * 0.8 * ( i + 1 ) / currentSegment );
		this.rects.children[i].fill = 'rgb('+col+','+col+','+col+')';
	}
	for( var i = currentSegment ; i < this.rects.children.length ; i++ ){
		var col = parseInt( 255 * 0.1 + 255 * 0.8 * ( i - currentSegment ) / ( this.rects.children.length - currentSegment ) );
		this.rects.children[i].fill = 'rgb('+col+','+col+','+col+')';
	}
	this.oldSegment = currentSegment;
};

module.exports = StepGradient;