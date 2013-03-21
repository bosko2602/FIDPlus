FP.Module.forumHighlightUsers =
{
	Category: FP.moduleCategories.Forum,
	Name: 'forumHighlightUsers',
	Pages: ['forumAll'],
	Css: ['forum_staff_highlight'],
	
	run: function()
	{
		this.count = this.showIcons();
	},
	
	change: function()
	{
		if (this.count == 0 || $('.fidplus-staff').length != this.count)
		{
			this.run();
		}
	},
	
	showIcons: function()
	{
		var count = 0;
		
		var doit = function(el, title)
		{
			var text = $(el).text().trim();
			
			$(el).addClass('fidplus-staff').attr('title', title.replace('{text}', text));
		};
		
		$.each(FP.Data.Contributors.Developers, function(key, data)
		{
			$('a:econtains("' + data.name + '")').each(function()
			{
				if (!$(this).hasClass('fidplus-staff'))
				{
					doit(this, '{text}, Fidplus Developer');
				}
				
				++count;
			});
		});
		
		$.each(FP.Data.Contributors.Translators, function(key, data)
		{
			$('a:contains("' + data.name + '")').each(function()
			{
				if (!$(this).hasClass('fidplus-staff'))
				{
					doit(this, '{text}, Fidplus ' + data.lang + ' Translator');
				}
				
				++count;
			});
		});
		
		$.each(FP.Data.Contributors.Donators, function(key, data)
		{
			$('a:contains("' + data.name + '")').each(function()
			{
				if (!$(this).hasClass('fidplus-staff'))
				{
					doit(this, '{text}, Fidplus Donator');
				}
				
				++count;
			});
		});
		
		return count;
	}
};