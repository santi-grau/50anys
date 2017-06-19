var tileVS = require('./../../../shaders/tileVS.glsl');
var tileFS = require('./../../../shaders/tileFS.glsl');

var BaseTiles = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.active = false;
	this.animate = block.a;
}

BaseTiles.prototype.create = function( reps, tex, texName ) {
	this.texName = texName;
	this.reps = reps;
	var reps = reps || 3;
	var repeat = new THREE.Vector2( reps, reps );
	var ar = this.block.w / this.block.h;
	var offset = new THREE.Vector2( 0 , 0 );
	if( ar > 1 ) repeat.x *= ar;
	else repeat.y *= this.block.h / this.block.w;

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

	var loader = new THREE.TextureLoader();

	var texture = loader.load( tex || this.parent.parent.parent.textures.txtrs.checkers, function ( texture ) {
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
			time: { value: new THREE.Vector2( 0, 0 ) },
			col1 : { value : new THREE.Vector4( 0, 0, 0, 1 ) },
			col2 : { value : new THREE.Vector4( 0, 0, 0, 0 ) }
		},
		vertexShader: tileVS,
		fragmentShader: tileFS,
		transparent : true
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 2 );
	
	this.group = new THREE.Group();
	this.group.add(plane);
	this.parent.parent.parent.scene.add( this.group );


	var geometry = new THREE.PlaneBufferGeometry( this.block.w + this.parent.lineWidth, this.block.h + this.parent.lineWidth );
	var material = new THREE.MeshBasicMaterial( { color : 0x000000 } );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0 );

	this.group.add(plane)

	var geometry = new THREE.PlaneBufferGeometry( this.block.w - this.parent.lineWidth, this.block.h - this.parent.lineWidth );
	var material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0 );

	this.group.add(plane)

};

BaseTiles.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	var w = scale;
	var printScale = 6 - this.parent.parent.parent.size;
	var fitX = Math.round( block.w / w ) * printScale;
	var fitY = Math.round( block.h / w ) * printScale;
	
	

	for( var i = 0 ; i < fitX; i++ ) for( var j = 0 ; j < fitY; j++ ) doc.save().translate(block.x + w * i / printScale, block.y + w * j / printScale ).scale(scale/512/printScale).path(patterns[this.texName]).fill('black').restore();
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).strokeColor('#000000').lineWidth(strokeWidth).stroke().restore();
	
}

module.exports = BaseTiles;