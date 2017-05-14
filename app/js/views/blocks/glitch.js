var baseVS = require('./../../../shaders/baseVS.glsl');
var glitchFS = require('./../../../shaders/glitchFS.glsl');

var Glitch = function( parent, block ) {

	this.parent = parent;
	this.block = block;

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

	var loader = new THREE.TextureLoader();

	var texture = loader.load( 'media/noise_col.jpg' , function ( texture ) {
		texture.generateMipmaps = false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	} );
	var texture2 = loader.load( 'media/sample2.jpg' , function ( texture ) {
		texture.generateMipmaps = false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	} );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			texture: { value: texture },
			texture2: { value: texture2 },
			time: { value: 0 },
			resolution : { value : new THREE.Vector2( this.block.w, this.block.h ) }
		},
		vertexShader: baseVS,
		fragmentShader: glitchFS
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0  );
	
	this.group = new THREE.Group();
	this.group.add(plane);
	this.parent.parent.scene.add( this.group );
	
}

Glitch.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}

Glitch.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = time/1000000;
};

module.exports = Glitch;