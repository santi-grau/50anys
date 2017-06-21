var blockScripts = {
	empty : require('./blocks/empty'),
	solid : require('./blocks/solid'),
	worms : require('./blocks/worms'),
	vStripes : require('./blocks/vStripes'),
	hStripes : require('./blocks/hStripes'),
	dStripes1 : require('./blocks/dStripes1'),
	dStripes2 : require('./blocks/dStripes2'),
	grid : require('./blocks/grid'),
	grid2 : require('./blocks/grid2'),
	crissCross : require('./blocks/crissCross'),
	hDashes : require('./blocks/hDashes'),
	dotsSolid : require('./blocks/dotsSolid'),
	dotsHollow : require('./blocks/dotsHollow'),
	waves : require('./blocks/waves'),
	arrows : require('./blocks/arrows'),
	sprinkles : require('./blocks/sprinkles'),
	zigZag : require('./blocks/zigZag'),
	dotBig : require('./blocks/dotBig'),
	dotNeg : require('./blocks/dotNeg'),
	crosses : require('./blocks/crosses'),
	tinyDots : require('./blocks/tinyDots'),
	spaceDots : require('./blocks/spaceDots'),
	glitch : require('./blocks/glitch'),
	gradient : require('./blocks/gradient'),
	noise1 : require('./blocks/noise1'),
	noise2 : require('./blocks/noise2'),
	points : require('./blocks/points'),
	layers : require('./blocks/layers'),
	bigx : require('./blocks/bigx'),
	colorGradient : require('./blocks/colorGradient'),
	delaunay : require('./blocks/delaunay'),
	voronoi : require('./blocks/voronoi'),
	stepGradient : require('./blocks/stepGradient'),
	fiftyFifty : require('./blocks/fiftyFifty'),
	tunel : require('./blocks/tunel'),
	perspective : require('./blocks/perspective'),
	shadowBars : require('./blocks/shadowBars'),
	ascii : require('./blocks/ascii'),
	bars : require('./blocks/bars')
}

var LoadingBlock = require('./blocks/loading');

var Block = function( parent, block, id, lineWidth, makeDom ){
	this.parent = parent;
	this.block = block;
	this.id = id;

	this.lineWidth = lineWidth;

	this.longPressTimer = 0;
	this.active = true;

	this.down = false;
	this.animateComplete = false;
	
	// create instance from block.t
	if( this.block.t ) this.currentBlock = new blockScripts[this.block.t]( this, this.block );
	else this.currentBlock = new LoadingBlock( this, this.block );

	this.currentBlock.animate = this.block.a;
}

Block.prototype.mouseEnter = function( e ){
	this.parent.parent.dom.selector.setActive( true, this );
}

Block.prototype.mouseLeave = function( e ){
	this.parent.parent.dom.selector.remove( );
}

Block.prototype.iterateBlock = function( ){
	var current = false, selected = false, newBlock;
	for ( var key in blockScripts ){
		if( current ){
			this.block.t = newBlock = key;
			selected = true;
			break;
		}
		if( key == this.block.t ) current = true;
	}

	if(!selected) this.block.t = newBlock = Object.keys(blockScripts)[0];
	this.parent.logoData.list[this.id].t = newBlock;
	if( this.parent.parent.ws.ready ) this.parent.parent.ws.socket.send(  JSON.stringify( { 't' : 'blockTexture', 'id' : this.id, 'blockTexture' : newBlock } ) );

	this.setBlockTexture( newBlock );
}

Block.prototype.setBlockTexture = function( block ){
	this.parent.parent.dom.selector.textureReady();
	
	this.destroy();

	this.block.t = block;
	this.currentBlock = new blockScripts[block]( this, this.block );

	if(this.currentBlock.group.type) this.parent.parent.threeLogoGroup.add( this.currentBlock.group );
	else this.parent.parent.twoLogoGroup.add( this.currentBlock.group );

}

Block.prototype.destroy = function(  ){
	console.log(this.currentBlock.group.parent)
	if(this.currentBlock.group.parent == null) this.parent.parent.scene.remove( this.currentBlock.group );
	if(this.currentBlock.group.type) this.parent.parent.threeLogoGroup.remove( this.currentBlock.group );
	else this.parent.parent.twoLogoGroup.remove( this.currentBlock.group );
}

Block.prototype.setBlockAnimate = function( animate ){
	this.block.a = animate;
	this.currentBlock.animate = animate;
}

Block.prototype.mousedown = function( e ){
	e.preventDefault();
	this.down = true;
	this.longPressTimer = setTimeout( this.animateTimerOn.bind(this), 500 );
	this.timerInterval = setTimeout( function(){
		e.target.style.cursor = 'none';
		this.parent.parent.dom.timer.down = true;
	}.bind(this), 100);
}

Block.prototype.animateTimerOn = function(){
	this.animateComplete = true;
	this.toggleAnimate();
	this.parent.parent.dom.timer.down = false;
	this.parent.parent.dom.timer.completed = true;
	setTimeout( this.parent.parent.dom.timer.reset.bind( this.parent.parent.dom.timer ), 300 );
}

Block.prototype.toggleAnimate = function(){
	this.parent.parent.dom.selector.animationReady( );
	this.block.a = !this.block.a;
	this.setBlockAnimate( this.block.a );
	if( this.parent.parent.ws.ready ) this.parent.parent.ws.socket.send(  JSON.stringify( { 't' : 'blockAnimate', 'id' : this.id, 'blockAnimate' : this.block.a } ) );
}

Block.prototype.mouseup = function( e ){
	clearTimeout(this.timerInterval);
	e.target.style.cursor = 'pointer';

	if( !this.down ) return;
	
	if( !this.animateComplete ) this.iterateBlock();

	this.parent.parent.dom.selector.setActive( true, this );
	this.animateComplete = false;

	clearTimeout( this.longPressTimer );
	this.down = false;
	this.parent.parent.dom.timer.down = false;
}

Block.prototype.step = function( time ){
	if( this.currentBlock.step ) this.currentBlock.step( time );
}

module.exports = Block;