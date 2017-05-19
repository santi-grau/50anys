var Selector = function( parent ) {
	this.parent = parent;
	this.containerEl = document.getElementById('selector');

	this.nameSpan = document.getElementById('name');
	this.animateSpan = document.getElementById('animate');
}

Selector.prototype.setActive = function( active, block ){
	clearTimeout( this.removeTimeout );
	this.nameSpan.innerHTML = block.t;
	this.animateSpan.innerHTML = block.a;
	this.containerEl.classList.add('active');
	this.containerEl.setAttribute('style', 'left:' + block.x + 'px;top:' + ( block.y + block.h / 2 ) + 'px;' );
}

Selector.prototype.remove = function( ){
	this.removeTimeout = setTimeout( function(){ this.containerEl.classList.remove('active') }.bind(this), 1000 );
}

module.exports = Selector;