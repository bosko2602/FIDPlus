FP.Module.managerLeagueLink =
{
	Category:	FP.moduleCategories.Presentation,
	Name:		'managerLeagueLink',
	Pages:		['managerOtherSummary'],
	
	run: function()
	{
		var
			league = $('label#M_M_M_C_C_C_labelTeamCurrentLeague').text().split(' ');
		
		if (league != '')
		{
			var
				iso = league[2],
				tier = league[1][0],
				name = league[0] + ' ' + league[1][1];
		
			$.each(FP.Data.leagues[iso].leagues, function(id, data)
			{
				if (data.tier == tier && data.name == name)
				{
					var link = $('<a>').attr('href', FP.Helper.fidLink(FP.fidPages['compOtherTable'], id)).text(league.join(' '));
					
					$('label#M_M_M_C_C_C_labelTeamCurrentLeague').html(link);
				}
			});
		}
	}
};