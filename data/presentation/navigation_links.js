FP.Module.navigationLinks =
{
	Category: FP.moduleCategories.Presentation,
	Css: 'navigation',
	Name: 'navigationLinks',
	Pages: ['fidAll'],
	
	run: function()
	{
		// Team shortcuts
		$('.level2Table .menu-item > a[href = "/Team/TeamGeneral/U134.aspx"]').parent().after(
			this.makeLink('teamOwnAwards', FPLang.get('navigation_awards'))
		).after(
			this.makeLink('teamOwnForum', FPLang.get('navigation_forum'))
		).after(
			this.makeLink('teamOwnPlayers', FPLang.get('navigation_players'))
		).after(
			this.makeLink('teamOwnSignup', FPLang.get('navigation_signup'))
		);
		
		$('a.top-menu-item[href = "/Team/TeamGeneral/U134.aspx"]').parent().after(
			this.makeListLink('teamOwnAwards', FPLang.get('navigation_awards'))
		).after(
			this.makeListLink('teamOwnForum', FPLang.get('navigation_forum'))
		).after(
			this.makeListLink('teamOwnPlayers', FPLang.get('navigation_players'))
		).after(
			this.makeListLink('teamOwnSignup', FPLang.get('navigation_signup'))
		);
		
		// League shortcuts
		var l1 = $('ul.level2 td.menu-item > a[href = "/WorldAndCompetition/StatisticsAndAwards/LeagueSpace.aspx"]').parent().parent();
		
		l1.append(
			this.makeLink('compOwnFixtures', FPLang.get('navigation_fixtures'))
		).append(
			this.makeLink('compOwnAwards', FPLang.get('navigation_awards'))
		).append(
			this.makeLink('compOwnPress', FPLang.get('navigation_press'))
		);
		
		var l2 = $('a.top-menu-item[href = "/WorldAndCompetition/StatisticsAndAwards/LeagueSpace.aspx"]').next().next();
		
		l2.append(
			this.makeListLink('compOwnFixtures', FPLang.get('navigation_fixtures'))
		).append(
			this.makeListLink('compOwnAwards', FPLang.get('navigation_awards'))
		).append(
			this.makeListLink('compOwnPress', FPLang.get('navigation_press'))
		);
		
		// League transfers, if enabled
		if (FPPrefs.moduleEnabled(FP.Module.leagueTransfers))
		{
			l1.append(
				this.makeLink('compOwnTable', FPLang.get('league_transfers'), {transfers: true})
			);
			
			l2.append(
				this.makeListLink('compOwnTable', FPLang.get('league_transfers'), {transfers: true})
			);
		}
	},
	
	makeLink: function(url, text, params)
	{
		if (typeof FP.fidPages[url] != 'undefined')
		{
			var link = $('<a>').attr({'href': FP.Helper.fidLink(url, params), 'title': text});
		}
		else
		{
			var link = $('<a>').attr({'href': url, 'title': text});
		}
		
		return $('<td>').addClass('menu-item').append
		(
			link.append
			(
				$('<table>').attr({'cellspacing': 0, 'cellpadding': 0}).append
				(
					$('<tr>').append
					(
						$('<td>').append(link.clone().text(text.toUpperCase()))
					)
				)
			)
		);
	},
	
	makeListLink: function(url, text, params)
	{
		return $('<li>').append(
			$('<a>').addClass('top-menu-item').attr('href', FP.Helper.fidLink(url, params)).text(text.toUpperCase())
		);
	}
};