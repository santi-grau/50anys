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
	var geometry = new THREE.PlaneBufferGeometry( this.block.w, 4 );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 1 );
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

Noise1.prototype.export = function( block, snap, scale, strokeWidth ){
	
	var s = block.h * scale;
	if( block.w > block.h ) s = block.w * scale;

	var vals = [];
	var v = null;
	var t = Math.random() * s;
	var noiseScale = 4;
	for( var i = 0 ; i < s * noiseScale ; i++ ){
		var n = Math.round( ( this.parent.parent.simplexNoise.noise2D( 0.5, t + i / 50 ) + 1 ) / 2 );
		if( v !== n ) vals.push( i );
		v = n;
	}
	vals.push( s * noiseScale );
	console.log(vals)

	var c = true;
	for( var i = 0 ; i < vals.length - 1 ; i++ ){
		var v0 = vals[i] / noiseScale;
		var v1 = vals[i+1] / noiseScale;

		var x = block.x * scale + v0, y = block.y * scale, w = v1 - v0, h = block.h * scale;
		if( block.h > block.w ) var x = block.x * scale, y = block.y * scale + v0, w = block.w * scale, h = v1 - v0;

		c = !c;
		if( c ) col = '#ffffff';
		else col = '#000000';
		
		snap.rect( x, y, w, h ).attr({ fill: col, stroke: 'none' });
	}

	var r = snap.rect( block.x * scale, block.y * scale, block.w * scale, block.h * scale);
	r.attr({ fill: 'none', stroke: '#000000', strokeWidth: strokeWidth });
}

Noise1.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fill('#ffffff').restore();
	
	var s = block.h;
	if( block.w > block.h ) s = block.w;

	var vals = [];
	var v = null;
	var t = Math.random() * s;
	var noiseScale = 4;
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

Noise1.prototype.destroy = function( val ){
	this.parent.parent.scene.remove(this.group);
}

Noise1.prototype.step = function( time ) {
	if( this.animate ) this.timeInc += ( this.timeTarget - this.timeInc ) * 0.03;
	else this.timeInc += ( 0 - this.timeInc ) * 0.03;
	this.time += this.timeInc;

	this.group.children[0].material.uniforms.time.value = this.time;
};

module.exports = Noise1;