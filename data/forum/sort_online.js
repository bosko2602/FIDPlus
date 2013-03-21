FP.Module.sortOnline =
{
	Category: FP.moduleCategories.Forum,
	Name: 'sortOnline',
	Pages: ['forumIndex'],
	
	run: function()
	{
		var list = [], element = $('div#forum_ctl01_ForumStats_ActiveUsers1');
		
		// Get online users
		$.each($('> a', element), function()
		{
			var id = $(this).attr('href').match(/u=([0-9]+)/)[1], name = $(this).text();
			
			list.push('<a href="default.aspx?g=profile&u=' + id + '" title="' + name + '">' + name + '</a>');
		});
		
		// Sort them a-z
		list.sort(function(a, b)
		{
			var aname = a.match('>(.+)</a>')[1], bname = b.match('>(.+)</a>')[1];
			
			return aname.toLowerCase().localeCompare(bname.toLowerCase());
		});
		
		// Replace the original list with the new, sorted list
		element.html(list.join(', '));
	}
};