var Layers = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Layers';

	this.amount = Math.floor(Math.random()*7) + 3;

	this.group = new THREE.Group();

	for( var i = 0 ; i < this.amount; i++ ){
	
		var geometry = new THREE.PlaneBufferGeometry( this.block.w - 2, this.block.h - 2 );
		var material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
		var plane = new THREE.Mesh( geometry, material );

		plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + i * 2, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y + i * 2, 1 + i * 2 + 10  );
		this.group.add(plane);

		var geometry
		if( i == 0) geometry = new THREE.PlaneBufferGeometry( this.block.w + 4, this.block.h + 4 );
		else geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

		var material = new THREE.MeshBasicMaterial( { color : 0x000000 } );
		var plane = new THREE.Mesh( geometry, material );

		plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + i * 2, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y + i * 2, i * 2 + 10  );
		this.group.add(plane);
	}

	this.py = this.amount;
	this.tween = TweenMax.to( this, 0.4, { paused : !this.animate, py : 1, repeat : Infinity, yoyo : true, repeatDelay : 0.5, onRepeat: this.onRepeat.bind(this), ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );

	this.parent.parent.scene.add( this.group );
}

Layers.prototype.exportPDF = function( block, doc, scale, strokeWidth, layer ){
	var sw = strokeWidth;
	if( layer > 0 ) sw = strokeWidth * 0.25;
	doc.save().translate( block.x + layer * strokeWidth * 0.5, block.y - layer * strokeWidth * 0.5 ).rect( 0, 0, block.w, block.h ).lineWidth(sw).fillAndStroke('#ffffff', '#000000').restore();
}

Layers.prototype.onRepeat = function( ){
	if(!this.animate) this.tween.pause();
}

Layers.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}

Layers.prototype.updateLayers = function( n ){
	for( var i = 0 ; i < this.group.children.length ; i++ ){
		if( i < n * 2 ) this.group.children[i].visible = true;
		else this.group.children[i].visible = false;
	}
}


Layers.prototype.step = function() {
	if( this.animate && this.tween.paused ) this.tween.play();
	if( Math.floor( this.oldpy ) !== Math.floor( this.py ) ) this.updateLayers( Math.floor( this.py ) );
	this.oldpy = Math.floor( this.py );
};

module.exports = Layers;