var baseVS = require('./../../../shaders/baseVS.glsl');
var noise2FS = require('./../../../shaders/noise2FS.glsl');

var Noise2 = function( parent, block ) {

	this.parent = parent;
	this.block = block;
	this.animate = block.a;

	this.name = 'Noise 2';

	this.time = Math.random() * 200;
	this.timeInc = 0;
	this.timeTarget = 0.11;

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			time: { value : this.time },
			resolution : { value : new THREE.Vector2( this.block.w, this.block.h ) }
		},
		vertexShader: baseVS,
		fragmentShader: noise2FS
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0  );
	
	this.group = new THREE.Group();
	this.group.add(plane);

	var material = new THREE.MeshBasicMaterial( { color : 0x000000 } );
	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.parent.lineWidth );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1 );
	this.group.add(plane);

	
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, this.parent.parent.containerThree.offsetHeight / 2 - this.block.y - this.block.h, 1  );
	this.group.add(plane);

	var geometry = new THREE.PlaneBufferGeometry( this.parent.lineWidth, this.block.h + this.parent.lineWidth );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1  );
	this.group.add(plane);

	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x + this.block.w, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1  );
	this.group.add(plane);

	this.parent.parent.scene.add( this.group );	
}

Noise2.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.lineJoin('miter');
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fill('#ffffff').restore();
	
	var s = block.h;
	if( block.w > block.h ) s = block.w;

	var vals = [];
	
	var p = Math.random();
	
	var scales = [0.75,1,1.25,1.5,1.75,2];
	var freqs = [90,75,60,45,30,15];

	var f = freqs[this.parent.parent.size];

	var noiseScale = scales[this.parent.parent.size];

	doc.save().moveTo( block.x, block.y );

	for( var i = 0 ; i < s ; i+= noiseScale ){
		var n = ( this.parent.parent.simplexNoise.noise2D( p, i/ f ) + 1 ) / 2 ;
		if( block.w > block.h ) doc.lineTo( block.x + i, block.y + n * block.h );
		else  doc.lineTo( block.x + n * block.w, block.y + i );
	}
	if( block.w > block.h ) doc.lineTo( block.x + block.w, block.y ).fill('#000000');
	else doc.lineTo( block.x, block.y + block.h ).fill('#000000');

	
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).stroke('#000000').restore();
}

Noise2.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;

	this.group.children[0].material.uniforms.time.value = this.time;
};

module.exports = Noise2;