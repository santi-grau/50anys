var Cursors = function(){
	this.containerEl = document.getElementById('cursors');
	this.data = {};
	this.pos = {};
}
Cursors.prototype.add = function( id, pos ){
	var div = document.createElement('div');
	div.classList.add('cursor');
	div.id = id;

	this.data[id] = {};
	this.data[id].el = div;
	this.data[id].pos = pos;
	this.containerEl.appendChild(div);
	
	var p = [];
	for ( var i = 0 ; i < 20 ; i++ ){
		p.push([0,0]);
	}
	this.pos[id] = p;
}

Cursors.prototype.remove = function( id ){
	var element = document.getElementById(id);
	element.parentNode.removeChild(element);
}

Cursors.prototype.step = function( ){
	for ( var key in this.data ){
		this.pos[key].shift();
		this.pos[key].push([ this.containerEl.offsetWidth / 2 + this.data[key].pos[0], this.containerEl.offsetHeight / 2 + this.data[key].pos[1] ]);
		var px = 0, py = 0;
		for( var i = 0 ; i < this.pos[key].length ; i++ ){
			px += this.pos[key][i][0];
			py += this.pos[key][i][1];
		}
		px /= this.pos[key].length;
		py /= this.pos[key].length;
		this.data[key].el.style.transform = 'translate3d(' + px + 'px, ' + py + 'px, 0)';	
	}
}

module.exports = Cursors;