FP.Module.moveCharacterGuide =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'moveCharacterGuide',
	Pages: ['playerOtherSummary', 'playerOwnSummary'],
	
	run: function()
	{
		try
		{
			var sections = $('div.subcolumnsHolder'), el = FP.pathname == FP.fidPages['playerOtherSummary'] ? 3 : 2;
			
			// Nice and simple :)
			sections.eq(1).insertAfter(sections.eq(el));
		}
		catch(e)
		{
			// !!!!!
			// Moving the guide is causing an error, not sure what to do with it.
			// !!!!!
		}
	}
};