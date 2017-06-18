var baseVS = require('./../../../shaders/baseVS.glsl');
var noise1FS = require('./../../../shaders/noise1FS.glsl');

var Noise1 = function( parent, block ) {

	this.parent = parent;
	this.block = block;
	this.animate = block.a;

	this.name = 'Noise 1';

	this.time = Math.random() * 200;
	this.timeInc = 0;
	this.timeTarget = 0.11;

	// var bg = new THREE.Mesh( new THREE.PlaneBufferGeometry( this.block.w, this.block.h ), new THREE.MeshBasicMaterial({ color : 0xffffff }) );
	// this.group.add(bg);

	var geometry = new THREE.PlaneBufferGeometry( this.block.w, this.block.h );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			time: { value : this.time },
			resolution : { value : new THREE.Vector2( this.block.w, this.block.h ) }
		},
		vertexShader: baseVS,
		fragmentShader: noise1FS
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

Noise1.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.lineJoin('miter');
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fill('#ffffff').restore();
	
	var s = block.h;
	if( block.w > block.h ) s = block.w;

	var vals = [];
	var v = null;
	var t = Math.random() * s;

	var scales = [32,24,16,12,8,4]

	var noiseScale = scales[this.parent.parent.size];
	for( var i = 0 ; i < s * noiseScale ; i++ ){
		var n = Math.round( ( this.parent.parent.simplexNoise.noise2D( 0.5, t + i / 50 ) + 1 ) / 2 );
		if( v !== n ) vals.push( i );
		v = n;
	}
	vals.push( s * noiseScale );

	var c = true;
	for( var i = 0 ; i < vals.length - 1 ; i++ ){
		var v0 = vals[i] / noiseScale;
		var v1 = vals[i+1] / noiseScale;

		var x = block.x + v0, y = block.y, w = v1 - v0, h = block.h;
		if( block.h > block.w ) var x = block.x, y = block.y + v0, w = block.w, h = v1 - v0;

		c = !c;
		if( !c ) doc.save().translate( x, y ).rect( 0, 0, w, h ).fill('#000000').restore();
	}
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).stroke('#000000').restore();
}

Noise1.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;

	this.group.children[0].material.uniforms.time.value = this.time;
};

module.exports = Noise1;