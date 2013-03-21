FP.Module.leagueForum =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'leagueForum',
	Pages: [
		'compOtherAwards', 'compOtherFixtures', 'compOtherPress', 'compOtherTable',
		'compOwnAwards', 'compOwnFixtures', 'compOwnPress', 'compOwnTable'
	],
	
	run: function()
	{
		var leagueid = $('a#M_M_M_C_ctl00_linkTeams').attr('href').getid('league');
		
		if (typeof FP.Data.leagueForums[leagueid] != 'undefined')
		{
			var text = FPLang.get('league_forum');
			
			$('ul.level2-selected td.menu-item').after(
				FP.Module.navigationLinks.makeLink(FP.Helper.forumLink(FP.Data.leagueForums[leagueid]), text)
			);
		}
	}
};