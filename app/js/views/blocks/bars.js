var Bars = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;
	this.timeInc = 0.01;
	this.time = 0;

	this.group = new THREE.Group();
	this.barsGroup = new THREE.Group();

	var blockWidth = Math.min( this.block.w, this.block.h ) / 6;
	var hbars = this.block.w / blockWidth;
	var vbars = this.block.h / blockWidth;

	var bars = [];

	this.positions = [];

	for( var i = hbars ; i > 0 ; i-- ){
		for( var j = 0 ; j < vbars ; j++ ){
			var px = - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + blockWidth * i - blockWidth / 2;
			var py = this.parent.parent.containerThree.offsetHeight / 2 - this.block.y - blockWidth * j - blockWidth / 2;
			
			this.positions.push([px,py]);
			var geometry = new THREE.PlaneBufferGeometry( blockWidth - 2, blockWidth - 2 );
			var material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
			var plane = new THREE.Mesh( geometry, material );

			plane.position.set( px, py, 0  );
			this.barsGroup.add(plane);

		}
	}

	this.group.add( this.barsGroup );
	this.parent.parent.scene.add( this.group );

}


Bars.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}



Bars.prototype.step = function( time ) {

	this.time += this.timeInc;
	
	for( var i = 0 ; i < this.barsGroup.children.length ; i++ ){
		var val = ( this.parent.parent.simplexNoise.noise2D( this.barsGroup.children[i].position.x /30, this.barsGroup.children[i].position.y /30 + this.time ) + 1) / 2;
		val *= 10;
		this.barsGroup.children[i].position.set( this.positions[i][0] + val,this.positions[i][1] + val, val);
	}
};

module.exports = Bars;