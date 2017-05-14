var TwoTris = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;

	this.tri1 = [
		new Two.Anchor(this.block.x, this.block.y),
		new Two.Anchor(this.block.x + this.block.w, this.block.y),
		new Two.Anchor(this.block.x , this.block.y + this.block.h)
	];


	this.tri2 = [
		new Two.Anchor(this.block.x + this.block.w, this.block.y + this.block.h),
		new Two.Anchor(this.block.x, this.block.y + this.block.h),
		new Two.Anchor(this.block.x + this.block.w, this.block.y),
	];


	var tri1 = new Two.Path(this.tri1, true, false, false);
	var tri2 = new Two.Path(this.tri2, true, false, false);

	tri1.fill = '#6B6C6F';
	tri2.fill = '#C0C2C4';

	this.group = this.parent.parent.two.makeGroup( tri1, tri2 );


}
TwoTris.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

TwoTris.prototype.step = function( time ) {
	
};

module.exports = TwoTris;