FP.Module.bookmarks =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'bookmarks',
	Pages: ['all'],
	Options: ['onForum'],
	Css: ['bookmarks'],
	bookmarks: [],
	
	run: function()
	{
		if (FP.isForum() && !FPPrefs.moduleOptionEnabled(this, 'onForum'))
		{
			return;
		}
		
		this.bookmarks = FPPrefs.getPref('bookmarks');
		
		var
			container = $('<div>').attr('class', 'bookmarks-container'),
			top = $('<div>').attr('class', 'title'),
			helpAnchor = $('<div>').attr('class', 'right').text('[?]'),
			helpText = $('<div>').attr({'class': 'list', 'id': 'help-text'}).html(FPLang.get('bookmarks_help')),
			bookmarksList = $('<div>').attr({'class': 'list', 'id': 'bookmarks-list'});
		
		container.hover(function()
		{
			bookmarksList.slideToggle('fast');
			
			if (top.hasClass('titleHover'))
			{
				top.removeClass('titleHover');
			}
			else
			{
				top.addClass('titleHover');
			}
		});
		
		helpAnchor.hover(function()
		{
			bookmarksList.toggle();
			helpText.toggle();
		});
		
		top.click(function()
		{
			FP.Module.bookmarks.addBookmark();
		});
		
		top.append($('<div>').attr('class', 'left').text('Bookmarks'));
		top.append(helpAnchor);
		
		container.append(top);
		container.append(bookmarksList.append(this.buildList()));
		container.append(helpText);
		
		// Display
		$(FP.isForum() ? 'div.yafnet' : 'div.site').prepend(container);
		
		// If there's not enough room, change the background colour
		// to black for easier visibility.
		var bannerArea = $('div#M_M_M_rightBanner1 > table');
		
		if (bannerArea.length == 1)
		{
			if (bannerArea.offset().left + bannerArea.width() + 1 > container.offset().left)
			{
				container.css('background', 'rgba(0, 0, 0, .80)');
			}
			
			// If the window is resized, then re-calculate whether to display
			// the transparent or black background.
			$(window).resize(function()
			{
				if (bannerArea.offset().left + bannerArea.width() + 1 > container.offset().left)
				{
					container.css('background', 'rgba(0, 0, 0, .80)');
				}
				else
				{
					container.css('background', 'rgba(0, 0, 0, .40)');
				}
			});
		}
	},
	
	addBookmark: function(url, text)
	{
		if (typeof text == 'undefined')
		{
			text = $.trim($('title').text());
		}
		
		if (typeof url == 'undefined')
		{
			url = FP.currUrl;
		}
		
		var name = prompt(FPLang.get('bookmarks_add'), text);
		
		if (name != null && name != '')
		{
			// Add to array and save
			this.bookmarks.push({'name': name, 'url': url});
			FPPrefs.setPref('bookmarks', this.bookmarks);
			
			// Now add to on-screen bookmarks list
			$('div#bookmarks-list').html(this.buildList());
		}
		
		return;
	},
	
	buildList: function()
	{
		var ul = $('<ul>'), li;
		
		if (this.bookmarks.length == 0)
		{
			return $('<div>').attr('id', 'help-text').text(FPLang.get('bookmarks_empty'));
		}
		else
		{
			this.bookmarks.sort(function(a, b)
			{
				return a.name.localeCompare(b.name);
			});
			
			$.each(this.bookmarks, function(key, data)
			{
				// Key used for deleting
				li = $('<li>').attr('key', key);
				
				li.mousedown(function(event)
				{
					// Right-click
					if (event.which == 3)
					{
						if (confirm(FPLang.get('bookmarks_delete_confirm')))
						{
							FP.Module.bookmarks.deleteBookmark($(this).attr('key'));
						}
					}
				});
				
				li.append($('<a>').attr({'href': data.url, 'no-team-popup': true}).text(data.name));
				
				ul.append(li);
			});
		}
		
		return ul;
	},
	
	deleteBookmark: function(key)
	{
		// Remove from preferences
		this.bookmarks.splice(key, 1);
		FPPrefs.setPref('bookmarks', this.bookmarks);
		
		// Remove from on-screen list
		$('li[key = ' + key + ']').remove();
		
		$('div#bookmarks-list').hide();
	}
};