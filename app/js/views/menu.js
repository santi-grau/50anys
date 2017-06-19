var Menu = function( parent ) {
	this.parent = parent;
	this.containerEl = document.getElementById('menu');

	this.infoBut = document.getElementById('infobut');
	this.info = document.getElementById('info');
	this.downBut = document.getElementById('downbut');
	this.formats = document.getElementById('formats');

	this.infoBut.addEventListener('click', this.showInfo.bind( this ) );
	this.info.addEventListener('click', this.hideInfo.bind(this) );
	this.downBut.addEventListener('click', this.toggleFormats.bind( this ) );

	this.formatList = this.formats.getElementsByClassName('formatSize');
}

Menu.prototype.updateUrls = function( id ) {
	this.downBut.classList.add('active');
	for( var i = 0 ; i < this.formatList.length ; i++ ){
		this.formatList[i].setAttribute('href', 'export#' + id + '/' + ( 5 - ( i ) ) )
	}
}

Menu.prototype.hideDownload = function( ) {
	this.downBut.classList.remove('active');
	this.formats.classList.remove('active');
}

Menu.prototype.showInfo = function( ) {
	this.info.classList.add('active');
}

Menu.prototype.hideInfo = function( ) {
	this.info.classList.remove('active');
}

Menu.prototype.downloadFile = function( e ) {
	console.log(e)
}

Menu.prototype.toggleFormats = function( ) {
	( !this.formats.classList.contains( 'active' ) ) ? this.formats.classList.add('active') : this.formats.classList.remove('active');	
}

module.exports = Menu;