var Selector = require('./selector');
var Timer = require('./timer');
var Cursors = require('./cursors');
var Menu = require('./menu');

var Dom = function( parent ) {
	this.parent = parent;

	var language = window.navigator.userLanguage || window.navigator.language;
	if( language == 'en-US') document.body.classList.add('en');

	this.startDate = new Date("September 20, 2016 12:00:00 GMT+2");

	this.scrollHeight = 3;

	this.length = 0;
	this.scrollPosition = 0;

	this.updateBackgroundColor( 0 );
	this.container = document.getElementById('main');
	this.buts = document.getElementById('buts');
	this.title = document.getElementById('title');

	

	this.selector = new Selector( this );
	this.timer = new Timer( this );
	this.cursors = new Cursors( this );
	this.menu = new Menu( this );
}

Dom.prototype.init = function( length ){
	this.length = length;
	this.current = this.old = this.length - 1;

	this.updateTitle();
	this.addClicks();
}

Dom.prototype.addClicks = function( ){
	var lastLogo = this.parent.previews[ this.parent.previews.length - 1 ];

	var blocks = lastLogo.logoData.list;

	for( var i = 0 ; i < blocks.length ; i++ ){
		var but = document.createElement('div');
		but.classList.add('block');
		this.buts.append( but );
	}
	this.bindButs();
	this.resize();
}

Dom.prototype.updatePreview = function( ){
	if( this.current == this.length - 1 ) document.body.classList.add('first');
	else document.body.classList.remove('first');
	this.parent.previews[this.old].destroyPreview();
	this.parent.previews[ this.current ].initPreview();
	this.menu.updateUrls( this.current );
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
	var blocks = this.buts.getElementsByClassName('block');
	for( var i = 0 ; i < blocks.length ; i++ ){
		blocks[i].addEventListener('mousedown', lastLogo.blocks[i].mousedown.bind( lastLogo.blocks[i] ) );
		blocks[i].addEventListener('touchstart', lastLogo.blocks[i].mousedown.bind( lastLogo.blocks[i] ) );		
		blocks[i].addEventListener('mouseup', lastLogo.blocks[i].mouseup.bind( lastLogo.blocks[i] ) );
		blocks[i].addEventListener('touchend', lastLogo.blocks[i].mouseup.bind( lastLogo.blocks[i] ) );
		blocks[i].addEventListener('mouseenter', this.selector.setActive.bind( this.selector, true, lastLogo.blocks[i] ) );
		blocks[i].addEventListener('mouseleave', this.selector.remove.bind(this.selector) );
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

Dom.prototype.updateBackgroundColor = function( v ){
	document.body.style.background = 'hsl(' + v * 360 + ', 0%, 88% )';
}

Dom.prototype.scroll = function(){
	this.title.classList.remove('active');
	var scrollPosition = window.scrollY / ( this.container.offsetHeight - window.innerHeight );
	this.current = ( this.length - 1 ) - Math.min( this.length - 1, Math.max( 0, Math.round( scrollPosition * ( this.length - 1 ) ) ) );
	console.log(scrollPosition)
	if( this.old !== this.current ) this.updatePreview();
	this.updateBackgroundColor( scrollPosition );

	this.old = this.current;
}

Dom.prototype.updateTitle = function(){
	var logoNum = document.getElementById('logoNum');

	var tt = String(this.current + 1).split('');
	var ttt = '';
	for( var i = 0 ; i < 5 - tt.length ; i++ ) ttt += '0';
	for( var i =0 ; i < tt.length ; i++ ) ttt += tt[i];

	logoNum.innerHTML = ttt;
	
	var dateNum = document.getElementById('dateNum');

	var day = new Date( this.startDate );
	day = day.setDate(day.getDate() + parseInt( this.current ) );
	day = new Date( day );
	var date = day.getDate() + '/' + ( day.getMonth() + 1 ) + '/' + day.getFullYear();

	dateNum.innerHTML = date;
}

Dom.prototype.scrollEnd = function(){
	this.title.classList.add('active');
	this.updateTitle();
}

Dom.prototype.step = function(){
	this.timer.step();
	this.cursors.step();
}
	
module.exports = Dom;