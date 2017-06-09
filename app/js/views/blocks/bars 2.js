var Bars = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name  = 'Bars';

	this.time = Math.random()*10;
	this.timeInc = 0;
	this.timeTarget = 0.01;
	this.displacement = 10;

	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.linewidth = this.parent.lineWidth;

	this.group = this.parent.parent.two.makeGroup( this.rect );

	this.group = new THREE.Group();
	this.topGroup = new THREE.Group();
	this.leftGroup = new THREE.Group();
	this.botGroup = new THREE.Group();
	this.bgGroup = new THREE.Group();

	var bw = Math.min( this.block.w, this.block.h ) / 3;
	var hbars = this.block.w / bw;
	var vbars = this.block.h / bw;

	var bars = [];

	this.positions = [];
	this.topPositions = [];
	this.leftPositions = [];
	this.botPositions = [];
	var depth = 0;
	for( var i = hbars ; i > 0 ; i-- ){
		for( var j = 0 ; j < vbars ; j++ ){
			var px = - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + bw * i - bw / 2;
			var py = this.parent.parent.containerThree.offsetHeight / 2 - this.block.y - bw * j - bw / 2;
			
			// backgorund
			var geometry = new THREE.BufferGeometry();
			var vertices = new Float32Array( [ -bw/2, bw/2, depth, bw/2, bw/2, depth, -bw/2, bw/2, depth, -bw/2, bw/2, depth, -bw/2, -bw/2, depth, bw/2, bw/2, depth, -bw/2, -bw/2, depth, bw/2, -bw/2, depth, bw/2, bw/2, depth, bw/2, -bw/2, depth, bw/2, -bw/2, depth, bw/2, bw/2, depth ] );

			this.topPositions.push(vertices.slice(0));
			geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			var material = new THREE.MeshBasicMaterial( {  color : 0x000000 } );
			var plane = new THREE.Mesh( geometry, material );
			plane.position.set( px, py, 0 );
			this.bgGroup.add(plane);

			// left plane
			var geometry = new THREE.BufferGeometry();
			var vertices = new Float32Array( [ -bw/2, bw/2-1, depth + 1, -bw/2, -bw/2+1, depth + 1, -bw/2, bw/2-1, depth + 1, -bw/2, -bw/2+1, depth + 1, -bw/2, -bw/2+1, depth + 1, -bw/2, bw/2-1, depth + 1 ] );

			this.leftPositions.push(vertices.slice(0));
			geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			var material = new THREE.MeshBasicMaterial( {  color : 0xffffff } );
			var plane = new THREE.Mesh( geometry, material );
			plane.position.set( px, py, 0 );
			this.leftGroup.add(plane);

			// bottom plane
			var geometry = new THREE.BufferGeometry();
			var vertices = new Float32Array( [ -bw/2, -bw/2, depth + 1, bw/2 -2, -bw/2, depth + 1, -bw/2, -bw/2, depth + 1, -bw/2, -bw/2, depth + 1, bw/2-2, -bw/2, depth + 1, bw/2-2, -bw/2, depth + 1 ] );

			this.botPositions.push(vertices.slice(0));
			geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			var material = new THREE.MeshBasicMaterial( {  color : 0xffffff } );
			var plane = new THREE.Mesh( geometry, material );
			plane.position.set( px, py, 0 );
			this.botGroup.add(plane);

			var geometry = new THREE.PlaneBufferGeometry( bw - 2, bw - 2 );
			var material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
			var plane = new THREE.Mesh( geometry, material );
			this.positions.push([px,py,depth + 1]);
			plane.position.set( px, py, depth + 1 );
			this.depths = depth + 1;
			this.topGroup.add(plane);

			depth += 2;
		}
	}
	this.group.add( this.bgGroup );
	this.group.add( this.topGroup );
	this.group.add( this.leftGroup );
	this.group.add( this.botGroup );
	this.parent.parent.scene.add( this.group );	
}

Bars.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
	this.parent.parent.two.remove( this.group );
}

Bars.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;
	
	for( var i = 0 ; i < this.bgGroup.children.length ; i++ ){
		var val = ( this.parent.parent.simplexNoise.noise2D( this.bgGroup.children[i].position.x /50 + this.time, this.bgGroup.children[i].position.y /50 ) + 1) / 2;
		val *= this.displacement;
		
		var nums = [3,4,5,6,7,8,15,16,17,24,25,26,30,31,32,33,34,35];
		for( var j = 0 ; j < nums.length ; j++ )this.bgGroup.children[i].geometry.attributes.position.array[nums[j]] = this.topPositions[i][nums[j]] + val;	
		this.bgGroup.children[i].geometry.attributes.position.needsUpdate = true;

		var nums = [6,7,8,12,13,14,15,16,17];
		for( var j = 0 ; j < nums.length ; j++ ) this.leftGroup.children[i].geometry.attributes.position.array[nums[j]] = this.leftPositions[i][nums[j]] + val;	
		this.leftGroup.children[i].geometry.attributes.position.needsUpdate = true;

		var nums = [3,4,5,6,7,8,15,16,17];
		for( var j = 0 ; j < nums.length ; j++ ) this.botGroup.children[i].geometry.attributes.position.array[nums[j]] = this.botPositions[i][nums[j]] + val;	
		this.botGroup.children[i].geometry.attributes.position.needsUpdate = true;
		
		this.topGroup.children[i].position.set( this.positions[i][0] + val, this.positions[i][1] + val, this.positions[i][2] + val  );
	}
};

module.exports = Bars;