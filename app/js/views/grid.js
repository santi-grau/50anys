var Grid = function( size ) {
	this.modSize = size;
	this.subDivisions = 10;
	this.lineWidth = 2;
	this.bgColor = '#ffffff';
	this.thickLineColor = '#dfdfdf';
	this.thinLineColor = '#f2f2f2';

	var canvas = document.createElement('canvas');
	canvas.width  = this.modSize * 2;
	canvas.height = this.modSize * 2;
	var ctx = canvas.getContext('2d');
	ctx.fillStyle= this.bgColor;
	ctx.lineWidth= this.lineWidth;
	ctx.fillRect(0,0,this.modSize * 2,this.modSize * 2);
	
	ctx.strokeStyle= this.thinLineColor;
	for( var i = 1 ; i < this.subDivisions ; i++ ){
		var m = ( this.modSize * 2 ) * i / this.subDivisions;
		ctx.beginPath();
		ctx.moveTo( 0, m );
		ctx.lineTo( this.modSize * 2, m );
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo( m, 0 );
		ctx.lineTo( m,this.modSize * 2 );
		ctx.stroke();
	}

	ctx.strokeStyle = this.thickLineColor;
	ctx.beginPath();
	ctx.moveTo( 0, 0 );
	ctx.lineTo( this.modSize * 2, 0 );
	ctx.stroke();

	ctx.strokeStyle = this.thickLineColor;
	ctx.beginPath();
	ctx.moveTo( 0, this.modSize * 2 );
	ctx.lineTo( this.modSize * 2, this.modSize * 2 );
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo( 0, 0 );
	ctx.lineTo( 0, this.modSize * 2 );
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo( this.modSize * 2, 0 );
	ctx.lineTo( this.modSize * 2, this.modSize * 2 );
	ctx.stroke();

	var dt = canvas.toDataURL('image/png');

	document.body.style.background = 'url('+dt+')';
	document.body.style['background-size'] = this.modSize+'px ' + this.modSize+'px';

	this.resize();
}

Grid.prototype.resize = function(){
	document.body.style['background-position'] = ( window.innerWidth / 2 - this.modSize ) + 'px ' + ( window.innerHeight / 2 - this.modSize ) + 'px';
}

module.exports = Grid;