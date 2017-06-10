var Selector = function( parent ) {
	this.parent = parent;
	this.containerEl = document.getElementById('selector');

	this.nameSpan = document.getElementById('name');
	this.animateSpan = document.getElementById('animate');

	this.textureDescription = document.getElementById('textureDescription');
	this.animateDescription = document.getElementById('animateDescription');
}

Selector.prototype.setActive = function( active, block ){
	clearTimeout( this.removeTimeout );
	this.nameSpan.innerHTML = block.currentBlock.name || 'N/A';
	this.animateSpan.innerHTML = ( block.currentBlock.noAnimate ) ? 'N/A' : ( ( block.block.a ) ? 'Yes' : 'No' );
	this.containerEl.classList.add('active');
	if( block.block.x < this.parent.containerEl.offsetWidth / 2 ){
		this.containerEl.classList.remove('left');
		this.containerEl.classList.add('right');
		this.containerEl.setAttribute('style', 'left:' + (  this.parent.containerEl.offsetLeft + block.block.x + block.block.w + this.parent.moduleSize * 0.6 ) + 'px;top:' + ( block.block.y + block.block.h / 2 + this.parent.containerEl.offsetTop ) + 'px;' );
	} else {
		this.containerEl.classList.remove('right');
		this.containerEl.classList.add('left');
		this.containerEl.setAttribute('style', 'left:' + ( block.block.x + this.parent.containerEl.offsetLeft ) + 'px;top:' + ( block.block.y + block.block.h / 2 + this.parent.containerEl.offsetTop ) + 'px;' );
	}
	
}

Selector.prototype.textureReady = function( ){
	this.textureDescription.classList.add('ready');
}

Selector.prototype.animationReady = function( ){
	this.animateDescription.classList.add('ready');
}

Selector.prototype.remove = function( ){
	this.removeTimeout = setTimeout( function(){ this.containerEl.classList.remove('active') }.bind(this), 100 );
}

module.exports = Selector;