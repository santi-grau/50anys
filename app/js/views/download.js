window.fs = require('fs');
var Block = require('./block');

var patterns = require('../../media/patterns2.svg');
var PDFDocument = require('pdfkit');
var blobStream  = require('blob-stream');

var Download = function( parent, data, id ){
	this.parent = parent;
	this.data = data;
	this.id = id;

	var sizes = ['A0','A1','A2','A3','A4','A5'];
	var lineWeights = [18,15,12,9,6,3];

	this.patterns = {};
	var ps = new DOMParser().parseFromString(patterns, "image/svg+xml").getElementsByTagName('path');
	for( var i = 0 ; i < ps.length ; i++ ) this.patterns[ps[i].getAttribute('id')] = ps[i].getAttribute('d');

	var tt = String( parseInt( this.id ) + 1 ).split('');
	var ttt = '';
	for( var i = 0 ; i < 5 - tt.length ; i++ ) ttt += '0';
	for( var i =0 ; i < tt.length ; i++ ) ttt += tt[i];
	this.id = ttt;
	var doc = new PDFDocument({
		size : sizes[this.parent.size],
		info: {
			Title: '50 Anys Eina | Logo #' + this.id,
			Author: 'Santi Grau'
		}
	});


	var moduleSize = 35;
	var lineWidth = lineWeights[this.parent.size];

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
		doc.lineJoin('miter');
		this.blocks.push( new Block( this, { x : this.data.list[i].x * moduleSize, y : this.data.list[i].y * moduleSize, w : this.data.list[i].w * moduleSize, h : this.data.list[i].h * moduleSize, t : this.data.list[i].t, a : this.data.list[i].a }, i, this.parent.lineWidth, false ) );
	}

	for( var i = 0 ; i < blocks.length ; i++ ){
		blocks[i].x *= scale;
		blocks[i].y *= scale;
		blocks[i].w *= scale;
		blocks[i].h *= scale;
		blocks[i].x += doc.page.margins.left;
		blocks[i].y += doc.page.height / 2 - ( viewBox[1] / 2 + 2 ) * scale ;
		if( this.blocks[i].currentBlock.exportPDF && blocks[i].t !== 'layers' ) this.blocks[i].currentBlock.exportPDF( blocks[i], doc, scale, lineWidth, this.patterns, this.parent.size );
		if( blocks[i].t == 'layers' ) layerBlocks.push( i );
	}

	var maxLayers = 0;
	for( var i = 0 ; i < layerBlocks.length ; i++ ) maxLayers = Math.max( maxLayers, this.blocks[layerBlocks[i]].currentBlock.amount );

	for( var i = 0 ; i < maxLayers ; i++ ){
		for( var j = 0 ; j < layerBlocks.length ; j++ ){
			if( i < this.blocks[layerBlocks[j]].currentBlock.amount ) this.blocks[layerBlocks[j]].currentBlock.exportPDF( blocks[layerBlocks[j]], doc, scale, lineWidth, i );
		}
	}
	
	doc.fillColor('black').font('Courier').fontSize(8).text('------------------------',0,doc.page.height - doc.page.margins.bottom * 2 - 26, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });
	doc.fillColor('black').font('Courier').fontSize(8).text('EINA 50 ANYS / #'+this.id,0,doc.page.height - doc.page.margins.bottom * 2 - 15, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });
	doc.fillColor('black').font('Courier').fontSize(8).text('------------------------',0,doc.page.height - doc.page.margins.bottom * 2 - 6, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });
   	
   	var id = this.id;

	setTimeout( function(){
		doc.end();
		stream.on('finish', function(){
			blob = stream.toBlob('application/pdf');
			var csvUrl = URL.createObjectURL(blob);
			var element = document.createElement('a');
			element.setAttribute('href', csvUrl);

			window.location.href = csvUrl;
			// download
			element.setAttribute('download', 'eina_50_anys_logo' + id);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);



		})
	}, 2000)
	
}

module.exports = Download;