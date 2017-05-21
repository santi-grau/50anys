var Block = function( parent, block, id ){
	this.parent = parent;
	this.block = block;
	this.id = id;

	this.down = false;
	this.animateComplete = false;
	
	// create dom element for this block
	this.containerEl = document.createElement('div');
	this.containerEl.classList.add('block');
	this.containerEl.setAttribute( 'style', 'width:' + block.w + 'px;height:' + block.h + 'px;left:' + block.x + 'px;top:' + block.y + 'px;' );
	this.parent.containerOne.append(this.containerEl);

	// add Event listeners for dom element
	this.containerEl.addEventListener('mousedown', this.mousedown.bind(this) );
	this.containerEl.addEventListener('mouseup', this.mouseup.bind(this) );
	this.containerEl.addEventListener('mouseenter', this.mouseEnter.bind(this) );
	this.containerEl.addEventListener('mouseleave', this.mouseLeave.bind(this) );

	// create instance from block.t
	this.currentBlock = new this.parent.blockScripts[this.block.t]( this, this.block );
}

Block.prototype.mouseEnter = function( e ){
	this.parent.selector.setActive( true, this.block );
}

Block.prototype.mouseLeave = function( e ){
	this.parent.selector.remove( );
}

Block.prototype.iterateBlock = function( ){
	var current = false, selected = false, newBlock;
	for ( var key in this.parent.blockScripts ){
		if( current ){
			this.block.t = newBlock = key;
			selected = true;
			break;
		}
		if( key == this.block.t ) current = true;
	}

	if(!selected) this.block.t = newBlock = Object.keys(this.parent.blockScripts)[0];

	if( this.parent.wsReady ) this.parent.ws.send(  JSON.stringify( { 't' : 'blockTexture', 'id' : this.id, 'blockTexture' : newBlock } ) );

	this.setBlockTexture( newBlock );
}

Block.prototype.setBlockTexture = function( block ){
	this.currentBlock.destroy();
	this.block.t = block;
	this.currentBlock = new this.parent.blockScripts[block]( this, this.block );
}

Block.prototype.setBlockAnimate = function( animate ){
	this.block.a = animate;
	this.currentBlock.animate = animate;
}

Block.prototype.destroy = function(){
	this.parent.containerOne.removeChild(this.containerEl);
	this.currentBlock.destroy();
}

Block.prototype.mousedown = function( e ){
	this.down = true;
	this.longPressTimer = setTimeout( this.animateTimerOn.bind(this), 1000 )
}

Block.prototype.animateTimerOn = function(){
	this.animateComplete = true;
}

Block.prototype.toggleAnimate = function(){
	this.block.a = !this.block.a;
	this.setBlockAnimate( this.block.a );
	if( this.parent.wsReady ) this.parent.ws.send(  JSON.stringify( { 't' : 'blockAnimate', 'id' : this.id, 'blockAnimate' : this.block.a } ) );
}

Block.prototype.mouseup = function( e ){
	if( !this.down ) return;
	
	if( this.animateComplete ) this.toggleAnimate();
	else this.iterateBlock();

	this.parent.selector.setActive( true, this.block );
	this.animateComplete = false;
	
	clearTimeout( this.longPressTimer );
	this.down = false;
}

Block.prototype.step = function( time ){
	this.currentBlock.step(time);
}

module.exports = Block;