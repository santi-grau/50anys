var patterns = require('../../media/patterns2.svg');
var PDFDocument = require('pdfkit');
var blobStream  = require('blob-stream');

var Download = function( parent ){
	this.parent = parent;
	this.containerEl = document.getElementById('download');
	this.exportImageBut = document.getElementsByClassName('exportImage');
	
	for(var i = 0 ; i < this.exportImageBut.length ; i++ ) this.exportImageBut[i].addEventListener('click', this.exportImage.bind(this) );
	this.patterns = {};
	var ps = new DOMParser().parseFromString(patterns, "image/svg+xml").getElementsByTagName('path');
	for( var i = 0 ; i < ps.length ; i++ ) this.patterns[ps[i].getAttribute('id')] = ps[i].getAttribute('d');
}

Download.prototype.exportImage = function( e ){
	var doc = new PDFDocument({
		size : 'A5',
		info: {
			Title: '50 Anys Eina | Logo 321',
			Author: 'Santi Grau'
		}
	});

	var stream = doc.pipe(blobStream());
	
	var viewBox = this.parent.logos[ this.parent.letterId ].viewBox;
	var scale = doc.page.width / ( viewBox[0] + 2 );

	doc.page.margins.top = scale;
	doc.page.margins.right = scale;
	doc.page.margins.bottom = scale;
	doc.page.margins.left = scale;
	
	var blocks = this.parent.logos[ this.parent.letterId ].list;

	var layerBlocks = [];

	for( var i = 0 ; i < blocks.length ; i++ ){
		blocks[i].x *= scale;
		blocks[i].y *= scale;
		blocks[i].w *= scale;
		blocks[i].h *= scale;
		blocks[i].x += doc.page.margins.left;
		blocks[i].y += doc.page.margins.top;
		if( this.parent.blocks[i].currentBlock.exportPDF && blocks[i].t !== 'layers' ) this.parent.blocks[i].currentBlock.exportPDF( blocks[i], doc, scale, 3, this.patterns );
		if( blocks[i].t == 'layers' ) layerBlocks.push( i );
	}

	var maxLayers = 0;
	for( var i = 0 ; i < layerBlocks.length ; i++ ) maxLayers = Math.max( maxLayers, this.parent.blocks[layerBlocks[i]].currentBlock.amount );

	for( var i = 0 ; i < maxLayers ; i++ ){
		for( var j = 0 ; j < layerBlocks.length ; j++ ){
			if( i < this.parent.blocks[layerBlocks[j]].currentBlock.amount ) this.parent.blocks[layerBlocks[j]].currentBlock.exportPDF( blocks[layerBlocks[j]], doc, scale, 3, i );
		}
	}

	console.log(maxLayers)

	setTimeout( function(){
		doc.end();
		stream.on('finish', function(){
			blob = stream.toBlob('application/pdf');
			var csvUrl = URL.createObjectURL(blob);
			var element = document.createElement('a');
			element.setAttribute('href', csvUrl);

			// open
			var w = window.open(csvUrl);

			// download
			// element.setAttribute('download', 'SVGexport');
			// element.style.display = 'none';
			// document.body.appendChild(element);
			// element.click();
			// document.body.removeChild(element);
		})
	}, 1000)
	
}



Download.prototype.show = function( show ){
	this.exportImage();
	// console.log(this.parent.textures.txtrsSvg)
	this.containerEl.classList.add('active')
}

Download.prototype.step = function( ){
	
}

module.exports = Download;