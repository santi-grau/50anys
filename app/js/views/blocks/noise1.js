var baseVS = require('./../../../shaders/baseVS.glsl');
var noise1FS = require('./../../../shaders/noise1FS.glsl');

var Noise1 = function( parent, block ) {

	this.parent = parent;
	this.block = block;

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

	var loader = new THREE.TextureLoader();

	var texture = loader.load( 'media/noise_gs.jpg' , function ( texture ) {
		texture.generateMipmaps = false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	} );


	var material = new THREE.ShaderMaterial( {
		uniforms: {
			texture: { value: texture },
			time: { value: new THREE.Vector2(0,0) },
			resolution : { value : new THREE.Vector2( this.block.w, this.block.h ) }
		},
		vertexShader: baseVS,
		fragmentShader: noise1FS
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0  );
	
	this.group = new THREE.Group();
	this.group.add(plane);
	this.parent.parent.scene.add( this.group );
	
}

Noise1.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}

Noise1.prototype.step = function( time ) {
	this.group.children[0].material.uniforms.time.value = new THREE.Vector2(time/100000,time/10000);
};

module.exports = Noise1;