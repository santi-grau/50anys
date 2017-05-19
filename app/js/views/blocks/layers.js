var Layers = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.props = {
		amount : 4
	}

	this.group = new THREE.Group();

	for( var i = 0 ; i < this.props.amount; i++ ){
	
		var geometry = new THREE.PlaneBufferGeometry( this.block.w - 2, this.block.h - 2 );
		var material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
		var plane = new THREE.Mesh( geometry, material );

		plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + i * 2, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y + i * 2, 1 + i * 2  );
		this.group.add(plane);

		var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );
		var material = new THREE.MeshBasicMaterial( { color : 0x000000 } );
		var plane = new THREE.Mesh( geometry, material );

		plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + i * 2, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y + i * 2, i * 2  );
		this.group.add(plane);
	}

	this.parent.parent.scene.add( this.group );
}

Layers.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}


Layers.prototype.step = function() {

};

module.exports = Layers;