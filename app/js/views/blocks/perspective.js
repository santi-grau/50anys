var Perspective = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;

	this.tri1 = [
		new Two.Anchor(this.block.x, this.block.y),
		new Two.Anchor(this.block.x + this.block.w, this.block.y),
		new Two.Anchor(this.block.x + this.block.w, this.block.y + Math.min(this.block.h,this.block.w) * this.inc),
		new Two.Anchor(this.block.x + Math.min(this.block.h,this.block.w) * this.inc, this.block.y + Math.min(this.block.h,this.block.w) * this.inc)
	];


	this.tri2 = [
		new Two.Anchor(this.block.x, this.block.y),
		new Two.Anchor(this.block.x, this.block.y + this.block.h ),
		new Two.Anchor(this.block.x + Math.min(this.block.h,this.block.w) * this.inc, this.block.y + this.block.h ),
		new Two.Anchor(this.block.x + Math.min(this.block.h,this.block.w) * this.inc, this.block.y + Math.min(this.block.h,this.block.w) * this.inc)
	];


	var tri1 = new Two.Path(this.tri1, true, false, false);
	var tri2 = new Two.Path(this.tri2, true, false, false);

	var w = this.block.w;
	var h = this.block.h;
	var rect = this.parent.parent.two.makeRectangle( this.block.x + w / 2, this.block.y + h / 2 , w, h );

	tri1.fill = '#323232';
	tri2.fill = '#B8BABC';

	this.group = this.parent.parent.two.makeGroup( rect, tri1, tri2  );


}
Perspective.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Perspective.prototype.step = function( time ) {
	
};

module.exports = Perspective;