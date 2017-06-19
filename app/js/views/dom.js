var Selector = require('./selector');
var Timer = require('./timer');
var Cursors = require('./cursors');
var Menu = require('./menu');

var Dom = function( parent ) {
	this.parent = parent;

	var language = window.navigator.userLanguage || window.navigator.language;
	if( language == 'en-US') document.body.classList.add('en');

	this.startDate = new Date("September 20, 2016 12:00:00 GMT+2");
	
	// console.log

	this.length = 0;
	this.current = 0;
	this.semi = 0;
	this.old = 0;
	this.oldSemi = 0;
	this.scrollPosition = 0;

	this.updateBackgroundColor( 0 );
	this.container = document.getElementById('main');

	this.selector = new Selector( this );
	this.timer = new Timer( this );
	this.cursors = new Cursors( this );
	this.menu = new Menu( this );
}

Dom.prototype.init = function( length ){
	this.length = length;
	for ( var i = this.length - 1; i >= 0; i-- ) {
		var inner = this.makeInner( i );
		this.container.appendChild( inner );
	}

	// this.menu.updateUrls( length - 1 );

	this.current = this.length - 1;
	this.semi = this.length - 1;
	this.old = this.length - 1;
	this.oldSemi = this.length - 1;

	this.addClicks()
}

Dom.prototype.addClicks = function( ){
	var lastLogo = this.parent.previews[ this.parent.previews.length - 1 ];

	var blocks = lastLogo.logoData.list;

	for( var i = 0 ; i < blocks.length ; i++ ){
		var but = document.createElement('div');
		but.classList.add('block');
		this.container.firstChild.append( but );
	}
	this.bindButs();
	this.resize();
}

Dom.prototype.mouseEnter = function( block ){
	this.selector.setActive( true, block );
}

Dom.prototype.mouseLeave = function( e ){
	this.selector.remove( );
}

Dom.prototype.updatePreview = function( ){

	if( this.current !== this.old && this.current !== this.oldSemi ) this.parent.previews[this.current].initPreview();
	if( this.semi !== this.oldSemi && this.semi !== this.old ) this.parent.previews[this.semi].initPreview();
	if( this.semi !== this.oldSemi && this.oldSemi !== this.current ) this.parent.previews[this.oldSemi].destroyPreview();

	if( this.current !== this.old && this.current < this.length - 1 ) this.menu.updateUrls( this.current );
	if( this.current !== this.old && this.current == this.length - 1 ) this.menu.hideDownload( this.current );

	this.old = this.current;
	this.oldSemi = this.semi;
}

Dom.prototype.makeInner = function( id ){
	
	var inner = document.createElement( 'div' );
	inner.classList.add( 'inner' );

	var title = document.createElement( 'div' );
	title.classList.add( 'title' );

	var tt = String(id + 1).split('');
	var ttt = '';
	for( var i = 0 ; i < 5 - tt.length ; i++ ) ttt += '0';
	for( var i =0 ; i < tt.length ; i++ ) ttt += tt[i];

	var day = new Date( this.startDate );
	day = day.setDate(day.getDate() + id );
	day = new Date( day );
	var date = day.getDate() + '/' + ( day.getMonth() + 1 ) + '/' + day.getFullYear();

	title.innerHTML = '-----------------------------------------<br />EINA 50 ANYS | #' + ttt + ' | ' + date + '<br/>-----------------------------------------';
	inner.appendChild( title );

	return inner;
}

Dom.prototype.bindButs = function( ){
	var lastLogo = this.parent.previews[ this.parent.previews.length - 1 ];
	var blocks = this.container.firstChild.getElementsByClassName('block');
	for( var i = 0 ; i < blocks.length ; i++ ){
		blocks[i].addEventListener('mousedown', lastLogo.blocks[i].mousedown.bind( lastLogo.blocks[i] ) );
		blocks[i].addEventListener('touchstart', lastLogo.blocks[i].mousedown.bind( lastLogo.blocks[i] ) );		
		blocks[i].addEventListener('mouseup', lastLogo.blocks[i].mouseup.bind( lastLogo.blocks[i] ) );
		blocks[i].addEventListener('touchend', lastLogo.blocks[i].mouseup.bind( lastLogo.blocks[i] ) );
		blocks[i].addEventListener('mouseenter', this.mouseEnter.bind( this, lastLogo.blocks[i] ) );
		blocks[i].addEventListener('mouseleave', this.mouseLeave.bind( this ) );
	}
}

Dom.prototype.resize = function( ){
	var lastLogo = this.parent.previews[ this.parent.previews.length - 1 ];
	
	var viewBox = lastLogo.logoData.viewBox;
	var blockData = lastLogo.logoData.list;
	var mod = this.parent.moduleSize;

	var blocks = this.container.firstChild.getElementsByClassName('block');
	for( var i = 0 ; i < blocks.length ; i++ ){
		var offsetX = window.innerWidth / 2 - ( viewBox[0] * mod ) / 2;
		var offsetY = window.innerHeight / 2 - ( viewBox[1] * mod ) / 2 - mod;
		blocks[i].setAttribute( 'style', 'width:' + blockData[i].w * mod + 'px;height:' + blockData[i].h * mod + 'px;left:' + (blockData[i].x * mod + offsetX ) + 'px;top:' + ( blockData[i].y * mod + offsetY) + 'px;' );
	}
}

Dom.prototype.addLetter = function( ){
	this.length++;
	var inner = this.makeInner( this.length - 1 );
	this.container.insertBefore( inner, this.container.firstChild );
}

Dom.prototype.updateBackgroundColor = function( v ){
	document.body.style.background = 'hsl(' + v * 360 + ', 0%, 88% )';
}

Dom.prototype.scroll = function(){
	this.scrollPosition = document.body.scrollTop;
	this.parent.two.scene.translation.y = -this.scrollPosition;
	this.parent.scene.position.y = this.scrollPosition;
	this.current = this.length - Math.round( this.scrollPosition / window.innerHeight ) - 1;

	var totalScroll = this.scrollPosition / this.container.offsetHeight;
	this.updateBackgroundColor( totalScroll );
	

	var p = this.length - this.scrollPosition / window.innerHeight - 1;
	if ( p > this.current ) this.semi = this.current + 1;
	else this.semi = Math.max( this.current - 1, 0 );
}

Dom.prototype.step = function(){
	this.timer.step();
	this.cursors.step();
	if( this.current !== this.old || this.semi !== this.oldSemi ) this.updatePreview();
	this.old = this.current;
}
	
module.exports = Dom;