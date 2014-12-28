FP.Module.leagueBadges =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'leagueBadges',
	Pages: ['compOtherTable', 'compOwnTable'],
	Options: ['ownColumn'],
	Css: ['league_badges'],
	
	run: function()
	{
		this.badges();
	},
	
	change: function()
	{
		var element = FPPrefs.moduleOptionEnabled(this, 'ownColumn') ? 'td.' : 'span#';
		
		if ($(element + 'fidplus-badge').length == 0)
		{
			this.badges();
		}
	},
	
	badges: function()
	{
		var
			$table = $('#M_C_LeagueTable_leagueStatisticsFull'),
			$header = $table.find('.header2'),
			$rows = $table.find('tr').not($header);
		
		if (FPPrefs.moduleOptionEnabled(this, 'ownColumn'))
		{
			// Add header
			$header.find('th:first').after('<td class="header" style="text-align: center">Badge</td>');
			
			$rows.each(function()
			{
				var
					$td = $(this).find('td:nth-child(2)'),
					teamid = $td.children().first().attr('href').match(/id=([0-9]+)/)[1];
				
				$td.before('<td class="fidplus-badge">' + FP.Helper.makeImage('team', teamid) + '</td>');
			});
		}
		else
		{
			$rows.each(function()
			{
				var $td = $(this).find('td:nth-child(2)');
				$td.attr('style', 'padding: 5px !important');
				
				var
					$link		= $td.children().first(),
					teamid		= $link.attr('href').match(/id=([0-9]+)/)[1];
				
				if ($link.find('span#fidPlusTeamName').length == 0)
				{
					teamname = $link.text();
				}
				else
				{
					teamname = $link.find('span#fidPlusTeamName').text();
				}
				
				var
					image = '<span id="fidplus-badge">' + FP.Helper.makeImage('team', teamid) + '&nbsp;</span>',
					html = FP.Helper.makeTeamLink(teamid, image + '<span id="fidPlusTeamName" style="text-decoration: underline">' + teamname + '</span>');
				
				$td.html(html);
			});
		}
	}
};