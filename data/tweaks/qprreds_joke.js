FP.Module.qprredsJoke =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'qprredsJoke',
	Pages: ['all'],
	
	run: function()
	{
		var title = 'By far the worst player that has ever and will ever exist in the world of fid.';
		
		$(':not(:has(*)):contains("Crookall")').each(function()
		{
			$(this).text($(this).text().replace('Crookall', 'Crapall'));
			$(this).attr('title', title);
		});
		
		if (FP.isForum())
		{
			$('div[id *= "forum_ctl01_MessageList_ctl0"]:contains("Crookall")').each(function()
			{
				$(this).html($(this).html().replace('Crookall', '<span title="' + title + '">Crapall</span>'));
			});
		}
	}
};