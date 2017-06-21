var Calendar = function(parent){
	this.parent = parent;
	this.containerEl = document.getElementById('calendar');
	this.containerEl.innerHTML = '&nbsp;';
	this.lineHeight = this.containerEl.offsetHeight;
	this.containerEl.innerHTML = '';
	
	this.totalLines = Math.floor( window.innerHeight / this.lineHeight ) - 2;

	this.lines = [];

	for( var i = 0 ; i < this.totalLines ; i++ ){
		var line = document.createElement('div');
		line.classList.add('line');
		this.containerEl.appendChild(line);
		var info = document.createElement('span');
		info.classList.add('info');

		if( i == 0 ) info.innerHTML = 'Today ';

		if( i == this.totalLines - 1 ) {
			var date = this.parent.startDate.getDate() + '/' + ( this.parent.startDate.getMonth() + 1 ) + '/' + this.parent.startDate.getFullYear();
			info.innerHTML = date + ' ';
		}
		line.appendChild(info);
		var dashes = document.createElement('span');
		dashes.classList.add('dashes');
		dashes.innerHTML = '-';
		line.appendChild(dashes);
		this.lines.push([info,dashes]);
	}

	this.containerEl.style['top'] = this.lineHeight + 'px';

	this.updateLines();
}

Calendar.prototype.updateLines = function( current ){
	var dampening = 4;
	var currentLine = Math.round( this.parent.scrollPosition * ( this.lines.length - 1 ) );
	var friendlyDates = [
		'yesterday',
		'2 days ago',
		'3 days ago',
		'4 days ago',
		'5 days ago',
		'6 days ago',
		'one week ago'
	];

	for( var i = 0; i < this.lines.length ; i++ ){
		if( i > 0 && i < this.lines.length - 1 ) this.lines[i][0].innerHTML = '';
		this.lines[i][1].innerHTML = '-';
	}
	if( this.lines[currentLine-3] ) this.lines[currentLine-3][1].innerHTML = '--';
	if( this.lines[currentLine-2] ) this.lines[currentLine-2][1].innerHTML = '---';
	if( this.lines[currentLine-1] ) this.lines[currentLine-1][1].innerHTML = '---';
	if( this.lines[currentLine] ) this.lines[currentLine][1].innerHTML = '<----';
	if( this.lines[currentLine + 1] ) this.lines[currentLine+1][1].innerHTML = '---';
	if( this.lines[currentLine + 2] ) this.lines[currentLine+2][1].innerHTML = '---';
	if( this.lines[currentLine + 3] ) this.lines[currentLine+3][1].innerHTML = '--';

	var date;

	if( friendlyDates[current] ) date = friendlyDates[current];
	else{
		var day = new Date( this.parent.startDate );
		day = day.setDate(day.getDate() + parseInt( current ) );
		day = new Date( day );
		date = day.getDate() + '/' + ( day.getMonth() + 1 ) + '/' + day.getFullYear();
	}
	
	
	if( this.lines[currentLine] && currentLine > 0 && currentLine < this.lines.length - 1 ) this.lines[currentLine][0].innerHTML = date + ' ';
}

module.exports = Calendar;