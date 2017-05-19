var Block = function(parent, block){
	this.parent = parent;
	this.block = block;
	this.down = false;
	this.toggleComplete = false;
	
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

Block.prototype.setCurrentBlock = function( ){
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
	this.currentBlock.destroy();
	this.currentBlock = new this.parent.blockScripts[newBlock]( this, this.block );
}

Block.prototype.mousedown = function( e ){
	this.down = true;
	this.longPressTimer = setTimeout( this.toggleAnimate.bind(this), 1000 )
}

Block.prototype.toggleAnimate = function(){
	this.toggleComplete = true;
}

Block.prototype.mouseup = function( e ){
	if( !this.down ) return;
	
	if( this.toggleComplete ) this.currentBlock.animate = this.block.a = !this.block.a;
	else this.setCurrentBlock();

	this.parent.selector.setActive( true, this.block );
	this.toggleComplete = false;
	
	clearTimeout( this.longPressTimer );
	this.down = false;
}

Block.prototype.step = function( time ){
	this.currentBlock.step(time);
}

module.exports = Block;