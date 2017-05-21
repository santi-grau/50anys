var letter1 = 	'0000000000000000\n';	var letter2 =	'000000000000000000000\n';	var letter3 =	'00000000000000000000\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'011111111000011111000\n';		letter3 +=		'01111111100111111110\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'011111111000111111100\n';		letter3 +=		'01111111100111111110\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'011100000001110001110\n';		letter3 +=		'01100000000000110000\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'011100000001110001110\n';		letter3 +=		'01100000000000110000\n';
letter1 += 		'0111100000000000\n';	letter2 +=	'011111110001110001110\n';		letter3 +=		'01111111100000110000\n';
letter1 += 		'0111100000000000\n';	letter2 +=	'011111111001110001110\n';		letter3 +=		'01111111100000110000\n';
letter1 += 		'0111100000000000\n';	letter2 +=	'000000011101110001110\n';		letter3 +=		'01100000000000110000\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'000000011101110001110\n';		letter3 +=		'01100000000000110000\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'011100011101110001110\n';		letter3 +=		'01111111100111111110\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'011100011101110001110\n';		letter3 +=		'01111111100111111110\n';
letter1 += 		'0111111111111110\n';	letter2 +=	'001111111000111111100\n';		letter3 +=		'00000000000000000000\n';
letter1 += 		'0111100000000000\n';	letter2 +=	'000111110000011111000\n';		letter3 +=		'00000000000000000000\n';
letter1 += 		'0111100000000000\n';	letter2 +=	'000000000000000000000';		letter3 +=		'01100001100000110000\n';
letter1 += 		'0111100000000000\n';												letter3 +=		'01110001100001111000\n';
letter1 += 		'0111111111111110\n';												letter3 +=		'01111001100001111000\n';
letter1 += 		'0111111111111110\n';												letter3 +=		'01111001100011111100\n';
letter1 += 		'0111111111111110\n';												letter3 +=		'01111101100011001100\n';
letter1 += 		'0111111111111110\n';												letter3 +=		'01101111100111001110\n';
letter1 += 		'0000000000000000';													letter3 +=		'01100111100111111110\n';
																					letter3 +=		'01100111100111111110\n';
																					letter3 +=		'01100011100110000110\n';
																					letter3 +=		'01100001100110000110\n';
																					letter3 +=		'00000000000000000000';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var blocks = ['empty','solid','checkers','vStripes','hStripes','triangles','plus','gridLines','crissCross','hDashes','dotsSolid','dotsHollow','trisTras','tdCubes','ls','zigZag','morisc','hexagon','crazyLines','tinyDots','dotsDiagonal','glitch','gradient','noise1','noise2','points','layers','bigx','colorGradient','delaunay','voronoi','stepGradient','fiftyFifty','tunel','twoTris','perspective','shadowBars','ascii','bars'];

var settings = {
	'empty' : {
		complexity : 0
	},
	'solid' : {
		complexity : 0
	},
	'checkers' : {
		complexity : 1
	},
	'vStripes' : {
		complexity : 1
	},
	'hStripes' : {
		complexity : 1
	},
	'triangles' : {
		complexity : 1
	},
	'plus' : {
		complexity : 1
	},
	'gridLines' : {
		complexity : 1
	},
	'crissCross' : {
		complexity : 1
	},
	'hDashes' : {
		complexity : 1
	},
	'dotsSolid' : {
		complexity : 1
	},
	'dotsHollow' : {
		complexity : 1
	},
	'trisTras' : {
		complexity : 1
	},
	'tdCubes' : {
		complexity : 1
	},
	'ls' : {
		complexity : 1
	},
	'zigZag' : {
		complexity : 1
	},
	'morisc' : {
		complexity : 1
	},
	'hexagon' : {
		complexity : 1
	},
	'crazyLines' : {
		complexity : 1
	},
	'tinyDots' : {
		complexity : 1
	},
	'dotsDiagonal' : {
		complexity : 1
	},
	'glitch' : {
		complexity : 1
	},
	'gradient' : {
		complexity : 0
	},
	'noise1' : {
		complexity : 1
	},
	'noise2' : {
		complexity : 1
	},
	'points' : {
		complexity : 1
	},
	'layers' : {
		complexity : 1
	},
	'bigx' : {
		complexity : 1
	},
	'colorGradient' : {
		complexity : 1
	},
	'delaunay' : {
		complexity : 1
	},
	'voronoi' : {
		complexity : 1
	},
	'stepGradient' : {
		complexity : 1
	},
	'fiftyFifty' : {
		complexity : 1
	},
	'tunel' : {
		complexity : 1
	},
	'twoTris' : {
		complexity : 1
	},
	'perspective' : {
		complexity : 1
	},
	'shadowBars' : {
		complexity : 1
	},
	'ascii' : {
		complexity : 1
	},
	'bars' : {
		complexity : 1
	}
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Shuffle(o) {
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

var App = function( l ) {
	this.order = 0.5;
	var letters = [letter1,letter2,letter3];
	this.data = [];
	this.banned = [];
	var lines = letters[ l || Math.floor( Math.random() * letters.length ) ].split('\n');
	for( var i = 0 ; i < lines.length ; i++ ) this.data.push(lines[i].split(''));
	for( var i = 0 ; i < this.data.length ; i++ ) for( var j = 0 ; j < this.data[i].length ; j++ ) this.data[i][j] = parseInt(this.data[i][j]);
	
	this.blocks = { viewBox : [ this.data[0].length, this.data.length ], list : [] };
	this.addBlock();
}

App.prototype.addBlock = function(){
	var avails = [];
	for( var i = 0 ; i < this.data.length ; i++ ) for( var j = 0 ; j < this.data[i].length ; j++ ) if( this.data[i][j] ) avails.push([i,j]);
	if( !avails.length ) return this.blocks;

	Shuffle(avails);

	var pieceDirection = Math.round(Math.random());
	var pieceLength = Math.floor( Math.random() * 10 ) + 1;

	for( var i = 0 ; i < this.banned.length ; i++ ) if( pieceDirection == this.banned[i][0] || pieceLength == this.banned[i][1] ) return this.addBlock();

	this.testFit( pieceDirection, pieceLength, avails );
}

App.prototype.blockType = function(){
	var simplex = [];
	var complex = [];
	for( var i = 0 ; i < blocks.length ; i++ ){
		if( settings[ blocks[ i ] ].complexity ) complex.push( blocks[ i ] );
		else simplex.push( blocks[ i ] );
	}

	return ( Math.random() > 0.6 ) ? ( complex[Math.floor( Math.random() * complex.length )] ) : (simplex[Math.floor( Math.random() * simplex.length )]);
}

App.prototype.computeAvailable = function(){
	var avails = [];
	for( var i = 0 ; i < this.data.length ; i++ ) for( var j = 0 ; j < this.data[i].length ; j++ ) if( this.data[i][j] ) avails.push([i,j]);
}

App.prototype.testFit = function( dir, length, avails ){
	for( var i = 0 ; i < avails.length ; i++ ){
		if( dir == 0 ){
			if( this.data[ avails[i][0] ].length < avails[i][1] + length ) continue;
			var testSequential = true;
			for( var j = 0 ; j < length ; j++ ) if( !this.data[ avails[i][0] ][ avails[i][1] + j ] ) testSequential = false;
			if( !testSequential ) continue;
			else return this.insert(dir,length,avails[i]);
		}

		if( dir == 1 ){
			if( this.data.length < avails[i][0] + length ) continue;
			var testSequential = true;
			for( var j = 0 ; j < length ; j++ ) if( !this.data[ avails[i][0] + j ][ avails[i][1] ] ) testSequential = false;
			if( !testSequential ) continue;
			else return this.insert(dir,length,avails[i]);
		}
	}

	this.banned.push(dir,length);
	this.addBlock();
}

App.prototype.insert = function(dir,length,pos){


	if( dir == 0 ){
		this.blocks.list.push( { x : pos[1], y : pos[0], w : length, h : 1, t : this.blockType(), a : Math.round( Math.random() ) } );
		for( var i = 0 ; i < length ; i++ ) this.data[pos[0]][pos[1]+i] = 0;
	}

	if( dir == 1 ){
		this.blocks.list.push( { x : pos[1], y : pos[0], w : 1, h : length, t : this.blockType(), a : Math.round( Math.random() ) } );
		for( var i = 0 ; i < length ; i++ ) this.data[pos[0]+i][pos[1]] = 0;
	}

	var str = '';
	for( var i = 0 ; i < this.data.length ; i++ ){
		for( var j = 0 ; j < this.data[i].length ; j++ ) str +=  this.data[i][j];
		str += '\n';
	}
	this.addBlock();
}

module.exports = App;