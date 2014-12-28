FP.Module.teamCountPlayers =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'teamCountPlayers',
	Pages: ['teamOtherInfo', 'teamOwnInfo'],
	
	run: function()
	{
		// The team the user plays for
		if (FP.querystring == '')
		{
			var url = FP.Helper.fidLink(FP.fidPages['teamOwnPlayers']);
		}
		// Any other team
		else
		{
			var url = FP.Helper.fidLink(FP.fidPages['teamOtherPlayers'], FP.querystring[0]);
		}
		
		$.get(url, function(data)
		{
			// Count the number of players
			var players = $('tr[id *= M_C_TeamPlayers_gridViewPlayersU72_DXDataRow]', data).length;
			
			var html =	'<tr><td><label class="fieldName">' + FPLang.get('team_players') + '</label></td>' +
						'<td style="text-align: right"><label>' + players + '</label></td></tr>';
			
			$('div.baseColumnRightSubcolumn table.infoSummary tbody tr:nth-child(3)').after(html);
			
			// Calculate and display average value
			var
				ttv = $('div.baseColumnRightSubcolumn table.infoSummary tbody tr:first td:eq(1) label').text().split(' ').join(''),
				avg = Math.round(parseInt(ttv) / players).toString();
			
			// Add spaces between each thousand.
			for (i = avg.length - 3; i > 0; i -= 3)
			{
			  avg = avg.substring(0 , i) + ' ' + avg.substring(i);
			}
			
			var html =	'<tr><td><label class="fieldName">' + FPLang.get('team_avg_value') + '</label></td>' +
						'<td style="text-align: right"><label>' + avg + '</label></td></tr>';
			
			$('div.baseColumnRightSubcolumn table.infoSummary tbody tr:nth-child(4)').after(html);
		});
	}
};