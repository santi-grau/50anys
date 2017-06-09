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
			time: { value: new THREE.Vector2( 0, 0 ) },
			col1 : { value : new THREE.Vector4( 0, 0, 0, 1 ) },
			col2 : { value : new THREE.Vector4( 0, 0, 0, 0 ) }
		},
		vertexShader: tileVS,
		fragmentShader: tileFS
	} );

	var plane = new THREE.Mesh( geometry, material );

	plane.position.set( this.block.w / 2 - this.parent.parent.containerThree.offsetWidth / 2 + this.block.x, -this.block.h / 2 + this.parent.parent.containerThree.offsetHeight / 2 - this.block.y, 0  );
	
	this.group = new THREE.Group();
	this.group.add(plane);
	this.parent.parent.scene.add( this.group );

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	this.twoGroup = this.parent.parent.two.makeGroup( rect );
};

// BaseTiles.prototype.export = function( block, snap, scale, strokeWidth, frame ){
	




// 	// displays to screen, rasterizes pattern
// 	var s = Snap();
// 	var p = Snap.parse( '<svg xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">' + this.parent.parent.textures.txtrsSvg[ this.texName ] + '</svg>' );
// 	var defs = snap.node.getElementsByTagName('defs')[0]
// 	var pattern = document.createElementNS('http://www.w3.org/2000/svg','pattern');
// 	pattern.setAttribute( 'id', this.texName );
// 	pattern.setAttribute( 'width', '512' );
// 	pattern.setAttribute( 'height', '512' );
// 	pattern.setAttribute( 'patternTransform', 'scale(' + scale/this.reps/512 + ')' );
// 	pattern.setAttribute( 'patternUnits', 'userSpaceOnUse' );
// 	pattern.innerHTML = p.node.innerHTML;
// 	defs.appendChild(pattern);
// 	var r = snap.rect( block.x * scale, block.y * scale, block.w * scale, block.h * scale);
// 	r.attr({ fill: 'url(#'+this.texName+')', stroke: '#000000', strokeWidth: strokeWidth });
// }

BaseTiles.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	var w = scale;
	var fitX = Math.round( block.w / w );
	var fitY = Math.round( block.h / w );

	for( var i = 0 ; i < fitX; i++ ) for( var j = 0 ; j < fitY; j++ ) doc.save().translate(block.x + w * i, block.y + w * j).scale(scale/512).path(patterns[this.texName]).fill('black').restore();
	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).strokeColor('#000000').lineWidth(strokeWidth).stroke().restore();
	
}

BaseTiles.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.twoGroup );
	this.parent.parent.scene.remove(this.group);
}

module.exports = BaseTiles;