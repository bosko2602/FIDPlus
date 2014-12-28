FP.Module.teamFounded =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'teamFounded',
	Pages: ['teamOtherInfo', 'teamOwnInfo'],
	
	run: function()
	{
		var ownTeam	= FP.pathname == FP.fidPages['teamOwnInfo'],
			teamid	= $('img#M_InfoBlockContainer_ctl00_infoBlockPhoto').attr('src').match(/id=([0-9]+)/)[1];
		
		if (ownTeam)
		{
			var url = FP.Helper.fidLink(FP.fidPages['teamOwnStats']);
		}
		else
		{
			var url = FP.Helper.fidLink(FP.fidPages['teamOtherStats'], teamid);
		}
		
		var seasons = [], prev = 0;
		
		$.get(url, function(doc)
		{
			var rows = $('tr[id *= M_C_Statistics_gridTeamStatisticsPerSeason_DXDataRow]', doc);
			
			if (rows.length > 0)
			{
				rows.each(function()
				{
					var season = $(this).find('> td:nth-child(2)').text();
					
					if (season > prev)
					{
						seasons.push(season);
					}
					
					prev = season;
				});
			}
			
			var element = ownTeam ? $('label#M_C_lblLeaguePos') : $('label#M_C_labelCurrentLeaguePositionValue'),
				founded = seasons.length == 0 ? FPLang.get('founded_this_season') : FPLang.get('founded_season_x').format(seasons[0]);
			
			element.parent().parent().after(
				'<tr>'
					+ '<td><label class="fieldName">' + FPLang.get('founded') + '</label></td>'
					+ '<td><label>'
						+ founded
					+ '</label></td>' +
				'</tr>'
			);
		});
	}
};