FP.Module.teamPopupLinks =
{
	Category: FP.moduleCategories.Tweaks,
	Name:	'teamPopupLinks',
	Pages: ['all'],
	Css: ['team_popup_links'],
	
	run: function()
	{
		var count = 0, ul, teamid, link;
		
		// Ignore team summary tab
		$('a.whiteTabTextLink[href *= "' + FP.fidPages['teamOtherInfo'] + '"]').attr('no-team-popup', true);
		
		if (FP.isForum())
		{
			// Little hack that means I don't have to re-declare all the css
			$('div.basicContentHolder').css('position', 'static');
		}
		
		$('a[href *= "Team/TeamGeneral/General/U71.aspx"]:not([no-team-popup])').live(
		{
			mouseenter: function(event)
			{
				if ($(this).attr('team-popup') == 'undefined' || $('ul.team-popup-link#' + $(this).attr('team-popup')).length != 1)
				{
					$(this).attr({
						'team-popup': ++count,
						'title': ''
					});
					
					ul = $('<ul>').attr({
						'class': 'team-popup-link',
						'id': count
					});
					
					ul.hover
					(
						function()
						{
							$(this).show();
						},
						function()
						{
							// Little effect here..
							$(this).hide('fast');
						}
					);
					
					var teamid = $(this).attr('href').getid();
					var teamname = $(this).text().trim();
					
					ul.append('<li class="title">' + FP.Helper.makeImage('team', teamid, 20) + ' ' + teamname + '</li>');
					ul.append(FP.Module.teamPopupLinks.makeList(teamid));
					
					$(FP.isForum() ? 'div.yafnet': 'body').append(ul);
					
					if (FPPrefs.moduleEnabled(FP.Module.bookmarks))
					{
						var link = $('<a>').text('Bookmark team').attr(
						{
							'href': FP.Helper.fidLink(FP.fidPages['teamOtherInfo'], teamid),
							'id': 'bookmark-link',
							'no-team-popup': true
						});
						
						$(link).click(function(event)
						{
							event.preventDefault();
							
							FP.Module.bookmarks.addBookmark(
								FP.Helper.fidLink(FP.fidPages['teamOtherInfo'], $(this).attr('href').getid()),
								teamname
							);
						});
						
						$('ul.team-popup-link#' + count).append($('<li>').append(link));
					}
				}
				
				var popup = $('ul.team-popup-link#' + $(this).attr('team-popup'));
				popup.css({'top': event.pageY - 10, 'left': event.pageX + 10});
				popup.show();
			},
			
			mouseleave: function (event)
			{
				var popup = $('ul.team-popup-link#' + $(this).attr('team-popup'));
				popup.hide();
			}
		});
	},
	
	makeList: function(teamid)
	{
		var
			links = ['Info', 'Players', 'Stats', 'Contracts', 'Awards', 'Press'],
			html = [];
		
		$.each(links, function(key, val)
		{
			if (val == 'Contracts')
			{
				teamid = {'id': teamid, 'cn': 0, 'tr': 0};
			}
			
			html.push(
				'<li><a href="' + FP.Helper.fidLink(FP.fidPages['teamOther' + val], teamid) + '" no-team-popup>' +
				FPLang.get('team_popup_' + val.toLowerCase()) + '</a></li>'
			);
		});
		
		return html.join('');
	}
};