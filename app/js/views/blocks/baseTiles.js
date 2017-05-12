var baseVS = require('./../../../shaders/baseVS.glsl');
var baseFS = require('./../../../shaders/baseFS.glsl');

var BaseTiles = function( parent, block ) {
	this.parent = parent;
	this.block = block;
}

BaseTiles.prototype.create = function( reps, tex ) {
	var reps = reps || 3;
	var repeat = new THREE.Vector2( reps, reps );
	var ar = this.block.w / this.block.h;
	var offset = new THREE.Vector2( Math.random(), Math.random() );
	var offset = new THREE.Vector2( 0 , 0 );
	if( ar > 1 ) repeat.x *= ar;
	else repeat.y *= this.block.h / this.block.w;

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );
	var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );

	var loader = new THREE.TextureLoader();

	var texture = loader.load( tex || this.parent.parent.textures.txtrs.checkers, function ( texture ) {
		texture.generateMipmaps = false;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	} );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			repeat: { value: repeat },
			offset: { value: offset },
			texture: { value: texture },
			time: { value: new THREE.Vector2(0,0) }
		},
		vertexShader: baseVS,
		fragmentShader: baseFS
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0  );
	
	this.group = new THREE.Group();
	this.group.add(plane);
	this.parent.parent.scene.add( this.group );
};

BaseTiles.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}

module.exports = BaseTiles;