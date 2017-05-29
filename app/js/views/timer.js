var Timer = function(){
	this.containerEl = document.getElementById('timer');
	this.canvas = document.getElementById('circleTimer');
	this.radius = 30;
	this.lineWidth = 4;
	this.degrees = 0;
	this.down = false;
	this.ctx = this.canvas.getContext('2d');
}

Timer.prototype.setPosition = function( position ){
	this.containerEl.style.transform = 'translate3d(' + ( position.x - 15 ) + 'px, ' + ( position.y - 15 ) + 'px, 0)';	
}

Timer.prototype.reset = function(){
	this.degrees = 0;
	this.completed = false;
}

Timer.prototype.step = function( ){
	if( this.down ){
		if( this.degrees < 360 ) this.degrees += 12;
		this.containerEl.classList.add('active');
	} else {
		Math.round( this.degrees -= this.degrees * 0.1 );
		this.containerEl.classList.remove('active');
	}

	if( this.completed ) this.degrees = 360;

	this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
	
	this.ctx.arc( this.canvas.width / 2, this.canvas.height / 2, this.radius / 2 + 5, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
	this.ctx.strokeStyle = 'rgba(0,0,0,0.9)';
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
	this.ctx.fill();

	this.ctx.beginPath();
	this.ctx.arc( this.canvas.width / 2, this.canvas.height / 2, this.radius / 2, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
	this.ctx.strokeStyle = 'rgba(0,0,0,0.6)';
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.stroke();


	this.ctx.beginPath();
	this.ctx.strokeStyle = '#ffffff';
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.arc( this.canvas.width / 2, this.canvas.height / 2, this.radius / 2, (Math.PI/180) * 270, (Math.PI/180) * (270 + this.degrees) );
	this.ctx.stroke();
}

module.exports = Timer;