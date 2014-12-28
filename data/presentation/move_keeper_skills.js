FP.Module.moveKeeperSkills =
{
	Category:	FP.moduleCategories.Presentation,
	Name:		'moveKeeperSkills',
	Pages:		['playerOwnSummary'],
	
	run: function()
	{
		if (FP.Helper.isKeeper())
		{
			var $container = $('#M_C_gridAttributes'), $header = $container.find('.groupRow:last');
			
			$header.add($header.nextAll()).prependTo($container);
		}
	}
};