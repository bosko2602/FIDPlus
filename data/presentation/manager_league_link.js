FP.Module.managerLeagueLink =
{
	Category:	FP.moduleCategories.Presentation,
	Name:		'managerLeagueLink',
	Pages:		['managerOtherSummary'],
	
	run: function()
	{
		var $league = $('#M_C_labelTeamCurrentLeague'),
			parts = $league.text().split(' ');
		
		if (parts.length > 0)
		{
			var iso = parts[2],
				tier = parts[1],
				name = parts[0] + ' ' + parts[1];
		
			$.each(FP.Data.leagues[iso].leagues, function(id, data)
			{
				if (data.tier == tier && data.name == name)
				{
					var link = $('<a>').attr('href', FP.Helper.fidLink(FP.fidPages['compOtherTable'], id)).text(parts.join(' '));
					
					$league.html(link);
				}
			});
		}
	}
};