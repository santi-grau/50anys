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
	
	var mod = this.parent.parent.moduleSize;
	var offsetX = window.innerWidth / 2 - ( block.parent.logoData.viewBox[0] * mod ) / 2;
	var offsetY = window.innerHeight / 2 - ( block.parent.logoData.viewBox[1] * mod ) / 2 - mod;

	if( block.block.x + offsetX < window.innerWidth / 2 ){
		this.containerEl.classList.remove('left');
		this.containerEl.classList.add('right');
		this.containerEl.setAttribute('style', 'left:' + (  offsetX + block.block.x + block.block.w + this.parent.parent.moduleSize * 0.6 ) + 'px;top:' + ( block.block.y + block.block.h / 2 + offsetY ) + 'px;' );
	} else {
		this.containerEl.classList.remove('right');
		this.containerEl.classList.add('left');
		this.containerEl.setAttribute('style', 'left:' + ( block.block.x + offsetX ) + 'px;top:' + ( block.block.y + block.block.h / 2 + offsetY ) + 'px;' );
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