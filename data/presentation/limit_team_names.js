FP.Module.limitTeamNames =
{
	Category:	FP.moduleCategories.Presentation,
	Name:		'limitTeamNames',
	Pages:		['compOtherTable', 'compOwnTable', 'teamOtherInfo', 'teamOwnInfo'],
	
	run: function()
	{
		var module = this;
		
		if ($.inArray(FP.pathname, [FP.fidPages['compOtherTable'], FP.fidPages['compOwnTable']]) != -1)
		{
			$('tr[id *= M_M_M_C_C_C_LeagueTable_gridViewLeagueStatistics_DXDataRow]').each(function()
			{
				var nameCell = $('.cellName .dxeHyperlink', this);
				
				nameCell.text(nameCell.text().limit(28));
			});
		}
		else if ($.inArray(FP.pathname, [FP.fidPages['teamOtherInfo'], FP.fidPages['teamOwnInfo']]) != -1)
		{
			// Last Matches
			$('tr[id *= M_M_M_C_C_C_gridViewLastMatchesSmall_DXDataRow]').each(function()
			{
				var a = $('.font11 a', this);
				
				a.text(a.text().limit(25));
			});
			
			// League table
			$('#M_M_M_C_C_C_leagueCompetitionSmall_gridViewLeagueTable tr').each(function()
			{
				var a = $('.cell a', this);
				
				a.text(a.text().limit(22));
			});
			
			// Team name
			var label = $('#M_M_M_C_C_C_labelTeamNameValue');
			
			label.text(label.text().limit(28));
		}
	}
};