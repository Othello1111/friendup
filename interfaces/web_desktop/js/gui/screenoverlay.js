/*©agpl*************************************************************************
*                                                                              *
* This file is part of FRIEND UNIFYING PLATFORM.                               *
* Copyright (c) Friend Software Labs AS. All rights reserved.                  *
*                                                                              *
* Licensed under the Source EULA. Please refer to the copy of the GNU Affero   *
* General Public License, found in the file license_agpl.txt.                  *
*                                                                              *
*****************************************************************************©*/

// This is an object!
var ScreenOverlay = {
	visibility: false,
	mode: false,
	done: false,
	debug: false,
	eula: true,
	list: [],
	// Public methods ----------------------------------------------------------
	init: function()
	{
		this.div = document.createElement( 'div' );
		this.div.id = 'FriendScreenOverlay';
		document.body.appendChild( this.div );
	},
	// Show self
	show: function( force )
	{
		console.log( 'EULA BEFORE SHOW' );
		var self = this;
		if( !force )
			if( this.visibility || !this.div ) return;
		this.visibility = true;
		this.div.classList.remove( 'Hidden' );
		this.div.classList.add( 'Visible' );
		setTimeout( function()
		{
			self.div.classList.add( 'Showing' );
		}, 5 );
		if( this.debug )
		{
			this.enableDebug();
<<<<<<< HEAD
		}
		console.log( 'EULA SHOW' );
=======
		}	
>>>>>>> master
	},
	// Trick hide
	invisible: function()
	{
		if( this.debug ) return;
		var self = this;
		if( !this.visibility || this.eula ) return;
		this.div.classList.add( 'Hiding' );
		setTimeout( function()
		{
			self.div.classList.remove( 'Showing' );
			self.div.classList.remove( 'Hiding' );
			setTimeout( function()
			{
				self.div.classList.add( 'Hidden' );
				self.div.classList.remove( 'Visible' );
				self.clearContent();
				self.done = true;
				
				// Make sure we update screen title and tray/tasks
				PollTaskbar();
			}, 250 );
		}, 250 );
	},
	// Hide self
	hide: function()
	{
		var self = this;
		if( this.debug ) return;
		if( this.eula )
		{
			var m = new Module( 'system' );
			m.onExecuted = function( e, d )
			{
				if( e != 'ok' )
				{
					return self.showEula();
				}
				return theHider();
			}
			m.forceHTTP = true;
			m.execute( 'getsetting', { setting: 'eula_accepted' } );
			self.show( true );
			return;
		}
		function theHider()
		{
			if( !self.visibility ) return false;
			self.div.classList.add( 'Hiding' );
			self.hidertime1 = setTimeout( function()
			{
				self.div.classList.remove( 'Showing' );
				self.div.classList.remove( 'Hiding' );
				self.hidertime2 = setTimeout( function()
				{
					self.div.classList.add( 'Hidden' );
					self.div.classList.remove( 'Visible' );
					self.visibility = false; // Done hiding!
					self.clearContent();
					self.done = true;
				}, 250 );
				self.div.classList.add( 'Hidden' );
				self.div.classList.remove( 'Visible' );
				self.visibility = false; // Done hiding!
				self.clearContent();
				self.done = true;
				
				setTimeout( function()
				{
					if( Workspace.applications )
					{
						for( var a = 0; a < Workspace.applications.length; a++ )
						{
							Workspace.applications[ a ].startupsequence = false;
						}
					}
				}, 4000 );
				
				// Make sure we update screen title and tray/tasks
				PollTaskbar();
				
				// Initialize tutorials
				if( !isMobile )
				{
					let tuts = new TutorialWidget( {
						x: 'right',
						y: 'bottom'
					} );
				}
				
				// Tell app we can show ourselves!
				if( window.friendApp && window.friendApp.reveal )
				{
					friendApp.reveal();
				}
				
			}, 250 );
			return true;
		}
		return theHider();
	},
	showEula: function()
	{
		this.div.classList.add( 'EULA' );
		var d = document.createElement( 'div' );
		d.className = 'SmoothScrolling EULA Loading';
		this.div.appendChild( d );
		var f = new File( 'System:templates/eula.html' );
		f.onLoad = function( data )
		{
			d.innerHTML = data;
			d.classList.remove( 'Loading' );
		}
		f.load();
	},
	acceptEula: function( mod )
	{
		var self = this;
		if( !mod ) return;
		var m = new Module( 'system' );
		m.onExecuted = function( e, d )
		{
			if( e == 'ok' )
			{
				self.div.classList.remove( 'EULA' );
				self.hide();
				self.eula = false;
			}
		}
		m.forceHTTP = true;
		m.execute( 'setsetting', { setting: 'eula_accepted', data: 'accepted' } );
	},
	setMode: function( mode )
	{
		switch( mode )
		{
			case 'text':
			case 'list':
				this.mode = mode;
				break;
			default:
				return false;
		}
	},
	setTitle: function( tt )
	{
		if( !this.div.stitle )
		{
			// Add box title
			var title = document.createElement( 'div' );
			title.className = 'Title';
			this.div.appendChild( title );
			this.div.stitle = title;
		}
		this.div.stitle.innerHTML = tt;
		
		var self = this;
		setTimeout( function()
		{
			self.div.stitle.classList.add( 'Showing' );
		}, 5 );
	},
	enableDebug: function()
	{
		this.debug = true;
		var self = this;
		if( !this.div.sdebug )
		{
			var deb = document.createElement( 'div' );
			deb.className = 'Debug';
			this.div.appendChild( deb );
			this.div.sdebug = deb;
		}
		var transl = i18n( 'i18n_debug_skip' );
		if( transl.substr( 0, 5 ) == 'i18n_' ) // translations race cond
			transl = 'Skip';
		this.div.sdebug.innerHTML = transl;
		this.div.sdebug.onclick = function()
		{
			self.debug = false;
			self.hide();
			Workspace.lastListStatus = self.list;
			self.list = {};
			Friend.startupApps = {};
		}
	},
	addDebug: function( str )
	{
		if( !this.div.sdebug ) return;
		var s = document.createElement( 'div' );
		s.className = 'DebugLine';
		s.innerHTML = str;
		this.div.sdebug.appendChild( s );
	},
	addStatus: function( topic, content )
	{
		if( !this.div.status )
		{
			// Add box status
			var status = document.createElement( 'div' );
			status.className = 'StatusBox';
			this.div.appendChild( status );
			this.div.status = status;
		}
		this.list.push( { topic: topic, content: content, status: 'Pending' } );
		this.renderStatus();
		return this.list.length - 1;
	},
	editStatus: function( slot, status )
	{
		this.list[ slot ].status = status;
		this.renderStatus();
	},
	renderStatus: function()
	{
		var str = '';
		for( var a = 0; a < this.list.length; a++ )
		{
			str += '<div class="HRow">';
			str += '<div class="HContent15 Topic FloatLeft">' + this.list[a].topic + ':</div>';
			str += '<div class="HContent45 Content FloatLeft">' + this.list[a].content + '</div>';
			str += '<div class="HContent40 Status FloatLeft ' + this.list[a].status + '">' + i18n( 'i18n_status_' + this.list[a].status ) + '</div>';
			str += '</div>';
		}
		str += '';
		this.div.status.innerHTML = str;
	},
	clearContent: function()
	{
		this.list = [];
		if( this.div && this.div.status )
			this.div.status.innerHTML = '';
	}
};

