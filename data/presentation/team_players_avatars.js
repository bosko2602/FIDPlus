/*!
 * Displays player avatars when viewing a team's footballers page.
 */
FP.Module.teamPlayersAvatars =
{
	Category: FP.moduleCategories.Presentation,
	Name:	'teamPlayersAvatars',
	Pages: ['teamOtherPlayers', 'teamOwnPlayers'],
	
	run: function()
	{
		this.avatars();
	},
	
	change: function()
	{
		if ($('td#FIDPlusAvatar').length == 0)
		{
			this.avatars();
		}
	},
	
	avatars: function()
	{
		var rows = $('tr[id *= M_C_TeamPlayers_gridViewPlayersU72_DXDataRow]');
		
		// Add avatar column header
		var html = '<td class="header" id="FIDPlusAvatar" style="text-align: center; width: 50px;">' + FPLang.get('avatar') + '</td>';
		$('td#M_C_TeamPlayers_gridViewPlayersU72_col0').after(html);
		
		// Remove contract header (free up space)
		//var remove = $('img[src="/Images/View.gif"]').length != 0;
		var remove = false;
		
		if (remove)
		{
			$('td#M_C_TeamPlayers_gridViewPlayersU72_DXTDGScol11').remove();
		}
		
		var byRole, playerid, image, link, tdhtml, children;
		
		rows.each(function()
		{
			children = $(this).children();
			
			// Account for sorting by role
			byRole = children.first().html() == '&nbsp;' ? true : false;
			
			// Remove contract field
			if (remove)
			{
				$('td:last', this).remove();
			}
			
			// Get player id
			playerid = $('a', children.eq(byRole ? 2 : 1)).attr('href').getid();
			
			image = FP.Helper.makeImage('character', playerid);
			link = FP.Helper.makePlayerLink(playerid, image);
			tdhtml = '<td style="padding: 3px; text-align: center">' + link + '</td>';
			
			$('td:nth-child(' + (byRole == true ? 2 : 1) + ')', this).after(tdhtml);
		});
	}
};