var Block = require('./block');

var Preview = function( parent, previewData, id, logoData ){
	this.parent = parent;
	this.previewData = {};
	this.logoData = logoData | null;
	this.id = id;
	this.twoGroup = this.parent.two.makeGroup( );
	this.state = { loading : false, preview : false, logo : false };

	this.parsePreviewData( previewData );
}

Preview.prototype.parsePreviewData = function( previewData ){
	var bb = [];
	var ps = previewData.split(/(?=(?:..)*$)/);
	var vb = [ parseInt( ps[ 0 ] ), parseInt( ps[ 1 ] ) ];
	for( var j = 2 ; j < ps.length ; j+= 4 ) bb.push([ parseInt( ps[ j ] ), parseInt( ps[ j + 1 ] ), parseInt( ps[ j + 2 ] ), parseInt( ps[ j + 3 ] ) ]);
	this.previewData = { vb : vb, bb : bb };
}

Preview.prototype.loadLogo = function( ){
	this.state.loading = true;
	if( this.logoData ) return this.initLogo();
	var oReq = new XMLHttpRequest();
	oReq.addEventListener('load', this.loadEnd.bind( this ) );
	oReq.open('GET', 'https://s3.eu-central-1.amazonaws.com/eina50/' + this.id + '.json');
	oReq.send();
}

Preview.prototype.loadEnd = function( data ){
	this.state.loading = false;
	this.logoData = JSON.parse( data.currentTarget.response );
	if( this.state.preview ) this.initLogo( );
}

Preview.prototype.initLogo = function( ){
	this.destroyPreview();
	this.state.logo = true;
	this.twoLogoGroup = this.parent.two.makeGroup( );
	this.twoGroup.add( this.twoLogoGroup );
	this.threeGroup = new THREE.Group();
	this.parent.scene.add(this.threeGroup);
	this.blocks = [];
	for( var i = 0 ; i < this.logoData.list.length ; i++ ){
		var d = this.logoData.list[i];
		var mod = this.parent.moduleSize;
		var block = new Block( this, { x : d.x * mod, y : d.y * mod, w : d.w * mod, h : d.h * mod, t : d.t, a : d.a }, i, this.parent.lineWidth, false );
		this.blocks.push( block );
		if( block.currentBlock.group.type ) this.threeGroup.add( block.currentBlock.group );
		else this.twoLogoGroup.add( block.currentBlock.group );
	}
	this.resize();
}

Preview.prototype.initPreview = function( ){
	this.state.preview = true;
	this.loadTimeout = setTimeout( this.loadLogo.bind(this), 500 );
	this.twoPreviewGroup = this.parent.two.makeGroup( );
	this.twoGroup.add( this.twoPreviewGroup );
	for( var i = 0 ; i < this.previewData.bb.length ; i++ ){
		var bp = this.previewData.bb[i];
		var mod = this.parent.moduleSize;
		var block = new Block( this, { x : bp[0] * mod, y : bp[1] * mod, w : bp[2] * mod, h : bp[3] * mod, t : null, a : false }, i, this.parent.lineWidth, false )
		this.twoPreviewGroup.add( block.currentBlock.group );
	}
	this.resize();
}

Preview.prototype.destroyPreview = function( ){
	this.state.preview = false;
	this.state.logo = false;
	this.blocks = [];
	this.twoGroup.remove( this.twoPreviewGroup );
	this.twoGroup.remove( this.twoLogoGroup );
	if( this.threeGroup ) this.parent.scene.remove( this.threeGroup );
	clearTimeout( this.loadTimeout );
}

Preview.prototype.resize = function( ){
	var offset = ( this.parent.previews.length - this.id - 1 ) * window.innerHeight - this.parent.moduleSize;
	this.twoGroup.translation.set( window.innerWidth / 2 - ( this.previewData.vb[0] * this.parent.moduleSize ) / 2, window.innerHeight / 2 - ( this.previewData.vb[1] * this.parent.moduleSize ) / 2 + offset );
	
	if( this.threeGroup ) this.threeGroup.position.x = window.innerWidth / 2 - ( this.previewData.vb[0] * this.parent.moduleSize ) / 2 ;
	if( this.threeGroup ) this.threeGroup.position.y = -window.innerHeight / 2 + ( this.previewData.vb[1] * this.parent.moduleSize ) / 2 - offset;
}

Preview.prototype.step = function( time ){
	for( var i = 0 ; i < this.blocks.length ; i++ ) this.blocks[i].step(time)
}

module.exports = Preview;