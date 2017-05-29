var baseVS = require('./../../../shaders/baseVS.glsl');
var glitchFS = require('./../../../shaders/glitchFS.glsl');

var Glitch = function( parent, block ) {

	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;
	
	this.name = 'Glitch';

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

	var loader = new THREE.TextureLoader();

	this.texture = loader.load( 'media/noise_col.jpg' , function ( texture ) {
		texture.generateMipmaps = false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	} );
	this.texture2 = loader.load( 'media/sample2.jpg' , function ( texture ) {
		texture.generateMipmaps = false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	} );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			texture: { value: this.texture },
			texture2: { value: this.texture2 },
			time: { value: Math.random() },
			resolution : { value : new THREE.Vector2( this.block.w, this.block.h ) },
			animate : { value : this.animate }
		},
		vertexShader: baseVS,
		fragmentShader: glitchFS
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0  );
	
	this.group = new THREE.Group();
	this.group.add(plane);

	var material = new THREE.MeshBasicMaterial( { color : 0x000000 } );
	var geometry = new THREE.PlaneBufferGeometry( this.block.w, 4 );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1  );
	this.group.add(plane);

	
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, this.parent.parent.containerThree.offsetHeight / 2 - this.block.y - this.block.h, 1  );
	this.group.add(plane);

	var geometry = new THREE.PlaneBufferGeometry( 4, this.block.h + 4 );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1  );
	this.group.add(plane);

	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + this.block.w, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1  );
	this.group.add(plane);

	this.parent.parent.scene.add( this.group );
	
}

Glitch.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}

Glitch.prototype.step = function( time ) {
	if( this.animate ){
		this.group.children[0].material.uniforms.time.value = Math.random() * 1000;
		this.group.children[0].material.uniforms.animate.value = this.animate;

	}
};

module.exports = Glitch;