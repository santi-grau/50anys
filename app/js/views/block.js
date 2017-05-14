var blockScripts = [
	require('./blocks/empty'),
	require('./blocks/solid'),
	require('./blocks/checkers'),
	require('./blocks/vStripes'),
	require('./blocks/hStripes'),
	require('./blocks/triangles'),
	require('./blocks/plus'),
	require('./blocks/gridLines'),
	require('./blocks/crissCross'),
	require('./blocks/hDashes'),
	require('./blocks/dotsSolid'),
	require('./blocks/dotsHollow'),
	require('./blocks/trisTras'),
	require('./blocks/tdCubes'),
	require('./blocks/ls'),
	require('./blocks/zigzag'),
	require('./blocks/morisc'),
	require('./blocks/hexagon'),
	require('./blocks/crazylines'),
	require('./blocks/tinydots'),
	require('./blocks/dotsDiagonal'),
	require('./blocks/glitch'),
	require('./blocks/gradient'),
	require('./blocks/noise1'),
	require('./blocks/noise2'),
	require('./blocks/points'),
	require('./blocks/layers'),
	require('./blocks/bigx'),
	require('./blocks/fourSquares'),
	require('./blocks/delaunay'),
	require('./blocks/voronoi'),
	require('./blocks/stepGradient'),
	require('./blocks/fiftyFifty'),
	require('./blocks/tunel'),
	require('./blocks/twoTris'),
	require('./blocks/perspective'),
	require('./blocks/shadowBars'),
	require('./blocks/ascii'),
	require('./blocks/bars')
]


var Block = function(parent, block){
	this.parent = parent;
	this.block = block;

	this.blockGen = Math.floor(Math.random() * blockScripts.length);
	this.active = false;
	// create domEl -> Dom element for this block
	this.domEl = document.createElement("div");
	this.domEl.classList.add('block');
	this.domEl.style.width = block.w + 'px';
	this.domEl.style.height = block.h + 'px';
	this.domEl.style.left = block.x + 'px';
	this.domEl.style.top = block.y + 'px';
	this.parent.containerOne.append(this.domEl);


	this.currentBlock = new blockScripts[this.blockGen]( this, this.block );

	// add Event listeners for dom element
	this.domEl.addEventListener('click', this.select.bind(this) );
}

Block.prototype.seqGen = function( o ){
	if( o ) this.blockGen++;
	else this.blockGen--;
	if(this.blockGen > blockScripts.length - 1 ) this.blockGen = 0;
	if(this.blockGen < 0 ) this.blockGen = blockScripts.length - 1;
	this.setCurrentBlock();
}

Block.prototype.setCurrentBlock = function( b ){
	this.currentBlock.destroy();
	this.currentBlock = new blockScripts[this.blockGen]( this, this.block );
}

Block.prototype.select = function( e ){
	if( !this.active ){
		this.domEl.classList.add('active');
		if( this.parent.active ) this.parent.active.domEl.classList.remove('active');
		if( this.parent.active ) this.parent.active.active = false;
		this.parent.active = this;
	} else {
		this.domEl.classList.remove('active');
		this.parent.active = null;
	}
	this.active = !this.active;
}

Block.prototype.step = function( time ){
	this.currentBlock.step(time);
}

module.exports = Block;