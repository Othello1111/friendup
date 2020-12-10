/*©agpl*************************************************************************
*                                                                              *
* This file is part of FRIEND UNIFYING PLATFORM.                               *
* Copyright (c) Friend Software Labs AS. All rights reserved.                  *
*                                                                              *
* Licensed under the Source EULA. Please refer to the copy of the GNU Affero   *
* General Public License, found in the file license_agpl.txt.                  *
*                                                                              *
*****************************************************************************©*/

/* Button class ------------------------------------------------------------- */

FUI.TabList = function( object )
{
	this.initialize( 'TabList' );
	this.flags = object;
}

FUI.TabList.prototype = new FUI.BaseClass();

// Default methods -------------------------------------------------------------

FUI.TabList.prototype.onPropertySet = function( property, value, callback )
{
	switch( property )
	{
		case 'text':
			this.flags.text = value;
			this.refresh();
			break;
	}
	return;
}

// Renderers -------------------------------------------------------------------

FUI.TabList.Renderers = {};

// "Signal Renderer"

FUI.TabList.Renderers.signal = function()
{
}

// HTML5 Renderer

FUI.TabList.Renderers.html5 = function( tablist )
{
	this.TabList = tablist;
	this.domNodes = [];
}
FUI.TabList.Renderers.html5.prototype.refresh = function( pnode )
{
	let self = this;
	
	if( !pnode && !self.TabList.parentNode ) return;
	if( !pnode )  pnode = self.TabList.parentNode;
	this.TabList.parentNode = pnode;
	
	if( !this.TabList.domNode )
	{
		let d = document.createElement( 'div' );
		d.style.position = 'absolute';
		d.style.top = '0';
		d.style.left = '0';
		d.style.width = '100%';
		d.style.height = '100%';
		d.style.overflow = 'auto';
		d.style.backgroundColor = FUI.theme.palette.foreground.color;
		d.style.boxSizing = 'border-box';
		this.TabList.domNode = d;
		pnode.appendChild( d );
		d.onclick = function( e )
		{
			if( self.TabList.events && self.TabList.events[ 'onclick' ] )
			{
				for( let z = 0; z < self.TabList.events[ 'onclick' ].length; z++ )
				{
					self.TabList.events[ 'onclick' ][ z ]( e );
				}
			}
		}
	}
	
	let d = this.TabList.domNode;
	
	if( this.TabList.flags.rows )
	{
		let rows = this.TabList.flags.rows;
		for( let a = 0; a < rows.length; a++ )
		{
			let r = document.createElement( 'div' );
			r.setAttribute( 'fui-component', 'TabList-Row' );
			r.style.position = 'relative';
			r.style.width = '100%';
			r.style.height = '30px';
			r.style.color = FUI.theme.palette.fillText.color;
			r.style.boxSizing = 'border-box';
			r.style.padding = FUI.theme.gadgets.margins.normal;
			
			if( rows[ a ].icon )
			{
				let icon = false;
				if( ( icon = FUI.getThemeIcon( rows[ a ].icon ) ) )
				{
					let i = document.createElement( 'div' );
					i.style.position = 'absolute';
					i.style.left = '0px';
					i.style.width = '30px';
					i.style.height = '100%';
					i.innerHTML = icon;
					r.appendChild( i );
				}
			}
			
			let t = document.createElement( 'div' );
			t.style.position = 'absolute';
			t.style.left = '30px';
			t.style.width = 'calc(100% - 60px)';
			t.style.height = '100%';
			t.innerHTML = rows[ a ].text;
			r.appendChild( t );
			
			
			d.appendChild( r );
		}
	}
	
	/*if( this.TabList.flags.text )
	{
		d.innerHTML = this.TabList.flags.text;
	}
	else
	{
		d.innerHTML = 'Unnamed button';
	}*/
}

