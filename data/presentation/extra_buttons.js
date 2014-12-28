FP.Module.extraButtons =
{
	Category:	FP.moduleCategories.Presentation,
	Name:		'extraButtons',
	Pages:		['playerOtherSummary', 'playerOwnSummary', 'teamOtherInfo', 'teamOwnInfo', 'managerOtherSummary'],
	Options:	['playerLink', 'teamLink'],
	
	run: function()
	{
		switch(FP.pathname)
		{
			// Player Link
			case FP.fidPages['playerOtherSummary']:
			case FP.fidPages['playerOwnSummary']:
			case FP.fidPages['managerOtherSummary']:
			
				var holder = $('<div>').css('margin-top', '10px');
				var playerid = playerid = FP.getId($('img.uploadPhoto').attr('src'));
				var pagetype = FP.isPage(['playerOtherSummary', 'playerOwnSummary']) ? 'footballer' : 'manager';
			
				if (FPPrefs.moduleOptionEnabled(this, 'playerLink'))
				{
					//var html = '<div style="clear: both"><br /><span style="color: #6D6D6B">' + FPLang.get('character_link') +
					//			'<br />' + FP.Helper.makePlayerLink(playerid) + '</span></div>';
					
					var	linkbutton = $('<div>').addClass('fp-button').text('Character Link');
					
					linkbutton.click(function()
					{
						var page = pagetype == 'footballer' ? 'playerOtherSummary' : 'managerOtherSummary';
						
						prompt('Copy the link below:', FP.Helper.fidLink(FP.fidPages[page], playerid));
					});
					
					holder.append(linkbutton);
				}
				
				if (FPPrefs.moduleOptionEnabled(this, 'advertisement'))
				{
					var adbutton = $('<div>').addClass('fp-button').css('margin-left', '5px').text('Post Advertisment');
					
					adbutton.click(function()
					{
						window.open('http://forum.footballidentity.com/default.aspx?g=postmessage&f=1940');
					});
					
					holder.append(adbutton);
				}
				
				holder.append('<br /><br />');
				
				var clear = '<div style="clear: both"></div>';
				
				if (FP.isPage(['playerOwnSummary', 'managerOtherSummary']))
				{
					$('table.infoSummary:first').after(holder);
				}
				else
				{
					$('div.baseColumnNarrower > div.subcolumnsHolder:first').append(clear).append(holder);
				}
				
				break;
			
			// Team link
			case FP.fidPages['teamOtherInfo']:
			case FP.fidPages['teamOwnInfo']:
			
				var
					teamid	= $('#M_InfoBlockContainer_ctl00_infoBlockPhoto').attr('src').match(/id=([0-9]+)/)[1],
					link	= $(FP.Helper.makeTeamLink(teamid)).attr('no-team-popup', true).toHtml(),
					html	= '<div style="color: #6D6D6B; padding: 3px">' + FPLang.get('team_link') + '<br />' + link + '</div>';
				
				$('div.baseColumn > div:nth-child(2) > table:nth-child(1)').before(html);
				
				break;
		}
	}
};