/*!
 * Shows a teams next few fixtures on the team summary page.
 */
FP.Module.teamFixtures =
{
	Category:	FP.moduleCategories.Tweaks,
	Name:		'teamFixtures',
	Pages:		['teamOtherInfo', 'teamOwnInfo'],
	
	teamname:	'',
	
	run: function()
	{
		this.teamname = $('#M_M_M_C_ctl00_teamNameLabel').text();
		
		// Bug in jQuery that can't handle brackets at the end, no choice but to give up.
		// See: http://bugs.jquery.com/ticket/5482
		// Bug found viewing this team with a stupidly long name: http://footballidentity.com/Team/TeamGeneral/General/U71.aspx?id=2049
		if (this.teamname[this.teamname.length - 1] != ')')
		{
			if (FP.querystring == '')
			{
				var fixtureslink = FP.Helper.fidLink('compOwnFixtures');
			}
			else
			{
				var leagueid = $('a#M_M_M_C_C_C_linkCurrentLeagueValue').attr('href').match(/id=([0-9]+)/)[1],
					fixtureslink = FP.Helper.fidLink('compOtherFixtures', leagueid);
			}
			
			$.get(fixtureslink, function(data)
			{
				/*
					When using the real url to the fixtures of a league you play in, FID incorrectly
					redirects to the league table, rather than the fixtures. Therefore we perform an
					additional check to see if this has happened, and query the correct url if so.
				*/
				if ($('label#M_M_M_C_C_C_LeagueTable_labelLeagueStatistics', data).text() != '')
				{
					$.get(FP.Helper.fidLink('compOwnFixtures'), function(data)
					{
						FP.Module.teamFixtures.getFixtures(data);
					});
				}
				else
				{
					FP.Module.teamFixtures.getFixtures(data);
				}
			});
		}
	},
	
	getFixtures: function(data)
	{
		var html =	'<h2>' + FPLang.get('team_matches') + '</h2>' +
					'<table cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-collapse: collapse; empty-cells: show;">';
		
		if (data.indexOf(FPLang.get('fixtures_no_data')) != -1)
		{
			html = html + '<tr><td style="padding: 3px 0px">' + FPLang.get('team_no_fixtures') + '</td><td></td></tr></table><br />';
		}
		else
		{
			var trs = $('#M_M_M_C_C_C_LeagueFixture_fixtureGridView_DXMainTable a:contains("' + this.teamname + '")', data).parent().parent(),
				trhtml = [],
				page = $('td.dxpCtrl td:first', data).text().match(/Page ([0-9]+) of ([0-9]+)/);
			
			trs.each(function()
			{
				var $this = $(this), $childs = $this.children(), $firstChild = $childs.first();
				
				if ($firstChild.find('img[src="/Images/View.gif"]').length == 0)
				{
					var $teams = $childs.filter('.cellName');
					
					if ($teams.first().text() == FP.Module.teamFixtures.teamname)
					{
						var $cell =  $teams.last().find('a'),
							where = 'H';
					}
					else
					{
						var $cell =  $teams.first().find('a'),
							where = 'A';
					}
					
					var opponent = $cell.text().limit(25),
						teamid = $cell.attr('href').match(/id=([0-9]+)/)[1],
						image = '';
					
					if (FP.isPage('teamOwnInfo'))
					{
						image = '<td style="width: 16px; padding: 3px 5px 3px 0px">' + $firstChild.find('a').toHtml() + '</td>';
					}
					
					trhtml.push(
						'<tr>' + image +
						'<td style="padding: 3px 0px">' + FP.Helper.makeTeamLink(teamid, opponent) +
						'</td><td style="text-align: left; padding: 3px 0px">' + where + '</td></tr>'
					);
				}
				
				lastround = $childs.eq(1).text();
				
				//
				// NOTE: Try to get the 5 next matches, rather than just 1-3.
				//
			});
			
			if (trhtml.length == 0 && page[1] == page[2])
			{
				html = html + '<tr><td style="padding: 3px 0px">' + FPLang.get('team_season_end') + '</td><td></td></tr></table><br />';
			}
			else
			{
				html = html + trhtml.join('') + '</table><br />';
			}
		}
	
		if (FP.querystring == '')
		{
			$('h2#M_M_M_C_C_C_h2MatchesSmall').before(html);
		}
		else
		{
			$('label#M_M_M_C_C_C_labelResultFrom5LastMatchesSummarySmall').parent().before(html);
		}
	}
};