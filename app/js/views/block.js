var Block = function( parent, block, id, lineWidth, makeDom ){
	this.parent = parent;
	this.block = block;
	this.id = id;

	this.lineWidth = lineWidth;

	this.longPressTimer = 0;
	this.active = true;

	this.down = false;
	this.animateComplete = false;
	
	// create dom element for this block
	if( makeDom ){
		this.containerEl = document.createElement('div');
		this.containerEl.classList.add('block');
		this.containerEl.setAttribute( 'style', 'width:' + block.w + 'px;height:' + block.h + 'px;left:' + block.x + 'px;top:' + block.y + 'px;' );
		this.parent.containerOne.append(this.containerEl);

		// add Event listeners for dom element
		this.containerEl.addEventListener('mousedown', this.mousedown.bind(this) );
		this.containerEl.addEventListener('touchstart', this.mousedown.bind(this) );
		this.containerEl.addEventListener('mouseup', this.mouseup.bind(this) );
		this.containerEl.addEventListener('touchend', this.mouseup.bind(this) );
		this.containerEl.addEventListener('mouseenter', this.mouseEnter.bind(this) );
		this.containerEl.addEventListener('mouseleave', this.mouseLeave.bind(this) );
	}
	// create instance from block.t
	this.currentBlock = new this.parent.blockScripts[this.block.t]( this, this.block );
	this.currentBlock.animate = this.block.a;

	// console.log(this.currentBlock.group);
}

Block.prototype.mouseEnter = function( e ){
	this.parent.selector.setActive( true, this );
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
	this.parent.selector.textureReady( );

	this.destroy();

	this.block.t = block;
	this.currentBlock = new this.parent.blockScripts[block]( this, this.block );

	if(this.currentBlock.group.type) this.parent.logoList[this.parent.letterId].threeGroup.add( this.currentBlock.group );
	else this.parent.logoList[this.parent.letterId].twoGroup.add( this.currentBlock.group );

}

Block.prototype.destroy = function(  ){
	if(this.currentBlock.group.type) this.parent.logoList[this.parent.letterId].threeGroup.remove( this.currentBlock.group );
	else this.parent.logoList[this.parent.letterId].twoGroup.remove( this.currentBlock.group );
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
		this.containerEl.style.cursor = 'none';
		this.parent.timer.down = true;
	}.bind(this), 100);
}

Block.prototype.animateTimerOn = function(){
	this.animateComplete = true;
	this.toggleAnimate();
	this.parent.timer.down = false;
	this.parent.timer.completed = true;
	setTimeout( this.parent.timer.reset.bind( this.parent.timer ), 300 );
}

Block.prototype.toggleAnimate = function(){
	this.parent.selector.animationReady( );
	this.block.a = !this.block.a;
	this.setBlockAnimate( this.block.a );
	if( this.parent.wsReady ) this.parent.ws.send(  JSON.stringify( { 't' : 'blockAnimate', 'id' : this.id, 'blockAnimate' : this.block.a } ) );
}

Block.prototype.mouseup = function( e ){
	clearTimeout(this.timerInterval);
	this.containerEl.style.cursor = 'pointer';

	if( !this.down ) return;
	
	if( !this.animateComplete ) this.iterateBlock();

	this.parent.selector.setActive( true, this );
	this.animateComplete = false;
	
	clearTimeout( this.longPressTimer );
	this.down = false;
	this.parent.timer.down = false;
}

Block.prototype.step = function( time ){
	this.currentBlock.step( time );
}

module.exports = Block;