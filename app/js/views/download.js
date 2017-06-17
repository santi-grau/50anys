var Block = require('./block');


var patterns = require('../../media/patterns2.svg');
var PDFDocument = require('pdfkit');
var blobStream  = require('blob-stream');

var Download = function( parent, data, id ){
	this.parent = parent;
	this.data = data;
	this.id = id;

	this.patterns = {};
	var ps = new DOMParser().parseFromString(patterns, "image/svg+xml").getElementsByTagName('path');
	for( var i = 0 ; i < ps.length ; i++ ) this.patterns[ps[i].getAttribute('id')] = ps[i].getAttribute('d');

	var tt = String(this.id).split('');
	var ttt = '';
	for( var i = 0 ; i < 5 - tt.length ; i++ ) ttt += '0';
	for( var i =0 ; i < tt.length ; i++ ) ttt += tt[i];

	var doc = new PDFDocument({
		size : 'A5',
		info: {
			Title: '50 Anys Eina | Logo #' + ttt,
			Author: 'Santi Grau'
		}
	});

	var stream = doc.pipe(blobStream());
	
	var viewBox = this.data.viewBox;
	var scale = doc.page.width / ( viewBox[0] + 2 );

	doc.page.margins.top = scale;
	doc.page.margins.right = scale;
	doc.page.margins.bottom = scale;
	doc.page.margins.left = scale;
	
	var blocks = this.data.list;

	var layerBlocks = [];
	this.blocks = [];

	for( var i = 0 ; i < blocks.length ; i++ ){
		this.blocks.push( new Block( this.parent, { x : this.data.list[i].x * this.parent.moduleSize, y : this.data.list[i].y * this.parent.moduleSize, w : this.data.list[i].w * this.parent.moduleSize, h : this.data.list[i].h * this.parent.moduleSize, t : this.data.list[i].t, a : this.data.list[i].a }, i, this.parent.lineWidth, false ) );
	}

	for( var i = 0 ; i < blocks.length ; i++ ){
		blocks[i].x *= scale;
		blocks[i].y *= scale;
		blocks[i].w *= scale;
		blocks[i].h *= scale;
		blocks[i].x += doc.page.margins.left;
		blocks[i].y += doc.page.margins.top;
		if( this.blocks[i].currentBlock.exportPDF && blocks[i].t !== 'layers' ) this.blocks[i].currentBlock.exportPDF( blocks[i], doc, scale, 3, this.patterns );
		if( blocks[i].t == 'layers' ) layerBlocks.push( i );
	}

	var maxLayers = 0;
	for( var i = 0 ; i < layerBlocks.length ; i++ ) maxLayers = Math.max( maxLayers, this.blocks[layerBlocks[i]].currentBlock.amount );

	for( var i = 0 ; i < maxLayers ; i++ ){
		for( var j = 0 ; j < layerBlocks.length ; j++ ){
			if( i < this.blocks[layerBlocks[j]].currentBlock.amount ) this.blocks[layerBlocks[j]].currentBlock.exportPDF( blocks[layerBlocks[j]], doc, scale, 3, i );
		}
	}

	// doc.font('media/mnl.ttc', 'Menlo-Regular')
 //   .text('This is Good Dog!')
 //   .moveDown(0.5)
		

	setTimeout( function(){
		doc.end();
		stream.on('finish', function(){
			blob = stream.toBlob('application/pdf');
			var csvUrl = URL.createObjectURL(blob);
			var element = document.createElement('a');
			element.setAttribute('href', csvUrl);
			var w = window.open(csvUrl,"_self");
		})
	}, 1000)
	
}

module.exports = Download;