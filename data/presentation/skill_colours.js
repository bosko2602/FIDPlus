FP.Module.skillColours =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'skillColours',
	Pages: ['playerOtherSummary', 'playerOwnSummary'],
	Css: ['skill_colours'],
	
	run: function()
	{
		var count = 0;
		
		$('td.cellLeft').each(function()
		{
			if (++count % 2 == 0)
			{
				$(this).parent().addClass(FP.Helper.skillColour($(this).text()));
			}
		});
	}
};