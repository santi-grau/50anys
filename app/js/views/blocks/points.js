var Points = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Points';

	this.time = 0;

	this.points = this.parent.parent.two.makeGroup();
	this.seq = 10;
	this.seqCount = 0;

	this.radius = 3;
	this.amount = 50;

	for( var i = 0 ; i < this.amount ; i++ ){
		var circle = this.parent.parent.two.makeCircle( this.block.x + this.radius + Math.random() * (this.block.w - this.radius * 2), this.block.y + this.radius + Math.random() * (this.block.h - this.radius * 2), this.radius  );	
		circle.noStroke();
		circle.fill = '#ffffff';
		this.points.add( circle );
	}
	
	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.fill = '#000000';
	rect.linewidth = this.parent.lineWidth;
	this.group = this.parent.parent.two.makeGroup( rect, this.points );
}

Points.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke('#000000', '#000000').restore();

	var radius = strokeWidth * 0.3;
	var amount = ( block.w / scale * block.h / scale ) * 10;

	for( var i = 0 ; i < amount ; i++ ){
		var r = Math.random() * radius + radius;
		doc.circle( block.x + r + Math.random() * ( block.w - r * 2 ), block.y + r + Math.random() * ( block.h - r * 2 ), r ).fill('#ffffff');
	}
}

Points.prototype.step = function() {
	
	if( !this.parent.active ) return;
	if( !this.animate ) return;
	this.seqCount++;
	if( this.seqCount % this.seq !== 0 ) return;
	for( var i = 0 ; i < this.points.children.length ; i++ ){
		this.points.children[i].scale = Math.random() * 0.5 + 0.5;
		this.points.children[i].translation.set( this.block.x + this.radius + Math.random() * (this.block.w - this.radius * 2), this.block.y + this.radius + Math.random() * (this.block.h - this.radius * 2) );
	}
};

module.exports = Points;