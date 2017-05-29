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

Points.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Points.prototype.step = function() {
	if( !this.animate ) return;
	this.seqCount++;
	if( this.seqCount % this.seq !== 0 ) return;
	for( var i = 0 ; i < this.points.children.length ; i++ ){
		this.points.children[i].scale = Math.random() * 0.5 + 0.5;
		this.points.children[i].translation.set( this.block.x + this.radius + Math.random() * (this.block.w - this.radius * 2), this.block.y + this.radius + Math.random() * (this.block.h - this.radius * 2) );
	}
};

module.exports = Points;