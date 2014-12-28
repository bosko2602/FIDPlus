FP.Module.leagueTransfers =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'leagueTransfers',
	Pages: [
		'compOtherAwards', 'compOtherFixtures', 'compOtherPress', 'compOtherTable',
		'compOwnAwards', 'compOwnFixtures', 'compOwnPress', 'compOwnTable'
	],
	leagueid: 0,
	
	run: function()
	{
		this.leagueid = $('#M_InfoBlockContainer_ctl00_linkTeams').attr('href').getid('league');
		
		if (FP.isOwnComp())
		{
			var
				page = 'compOwnTable',
				params = {transfers: true},
				press = FP.fidPages['compOwnPress'];
		}
		else
		{
			var
				page = 'compOtherTable',
				params = {id: this.leagueid, transfers: true},
				press = FP.fidPages['compOtherPress'] + '?id=' + this.leagueid;
		}
		
		var $el = $('td.thirdMenu_tabItem > a[href = "/' + press + '"]').parent(),
			$cell = $('<td class="thirdMenu_tabItem"></td>');
		
		var $link = $('<a>').attr('href', FP.Helper.fidLink(FP.fidPages[page], params)).append(
				$('<div class="thirdMenu_tabItem_ImgContainer"></div>').append(
					'<div class="thirdMenu_menuItemTabImage fid_menu_sprite_third-contracts-normal"></div>'
				)
			).append(
				'<span class="thirdMenu_tabItemText">Transfers</span>'
			);
		
		$cell.append($link);
		
		$el.after($cell);
		$el.after($el.prev().clone());
		
		if (FP.pathname == FP.fidPages['compOtherTable'] || FP.pathname == FP.fidPages['compOwnTable'])
		{
			if (typeof FP.queryObject['transfers'] != 'undefined')
			{
				this.transfers();
			}
		}
	},
	
	transfers: function()
	{
		// Sort out tabs first
		var tableUrl = FP.isOwnComp() ? FP.fidPages['compOwnTable'] : (FP.fidPages['compOtherTable'] + '?id=' + this.leagueid);
		
		var $tabs = $('.thirdMenu_tabItem');
		
		$tabs.removeClass('thirdMenu_tabItem_selected');
		$tabs.last().addClass('thirdMenu_tabItem_selected');
		
		// Get all the teams and their ids
		teams = [], teamsList = {};
		
		// Account for extra column
		var child = FPPrefs.moduleOptionEnabled(FP.Module.leagueBadges, 'ownColumn') ? 3 : 2;
		
		$('#M_C_LeagueTable_leagueStatisticsFull tr:not(.header2) td:nth-child(' + child + ') a').each(function()
		{
			tid = $(this).attr('href').match(/id=([0-9]+)/)[1];
			tname = $(this).text();
			
			teams.push({id: tid, name: tname});
			
			teamsList[tid] = tname;
		});
		
		// Erase league table
		$('#M_basicContent #M_C_LeagueTable_Div1').remove();
		holder = $('#M_basicContent .baseColumn');
		holder.empty();
		holder.width('100%');
		
		// Go to each team and get their transfers
		transfers = [], children = '', params = '';
		
		function getTransfers(index)
		{
			teamid = teams[index].id;
			
			params = {id: teamid, cn: 1, tr: 0};
			
			// Show progress
			progress = holder.find('span#transferProgress');
			
			if (progress.length == 0)
			{
				holder.append(
					$('<span id="transferProgress">').text(FPLang.get('league_transfers_get').format(index + 1))
				);
			}
			else
			{
				progress.html($('<span id="transferProgress">').text(FPLang.get('league_transfers_get').format(index + 1)));
			}
			
			$.get(FP.Helper.fidLink(FP.fidPages['teamOtherContracts'], params), function(doc)
			{
				if ($('h2#M_C_U70TeamInfoH2', doc).length != 0)
				{
					params = {cn: 1, tr: 0};
					
					$.get(FP.Helper.fidLink(FP.fidPages['teamOwnContracts'], params), function(doc)
					{
						doTransfers(doc, index);
					});
				}
				else
				{
					doTransfers(doc, index);
				}
			});
		}
		
		function doTransfers(doc, index)
		{
			var thisTeam = $('#M_InfoBlockContainer_ctl00_teamNameLabel', doc).text();
			
			$('tr[id *= M_C_Transfers_callbackPanelU76_gridViewTransfersU76_DXDataRow]', doc).each(function()
			{
				children = $(this).children();
				
				var
					date		= children.eq(2).text().split(' ')[0],
					dateParts	= date.slice(0, -1).split('.'),
					link		= children.eq(5).find('a'),
					to			= children.eq(8).find('a'),
					toId		= to.attr('href').match(/id=([0-9]+)/)[1],
					toLeague	= children.eq(9).find('a'),
					from		= children.eq(10).find('a'),
					fromId		= from.attr('href').match(/id=([0-9]+)/)[1]
					fromLeague	= children.eq(11).find('a'),
					fromName	= from.text();
				
				if (!(typeof teamsList[toId] != 'undefined' && typeof teamsList[fromId] != 'undefined' && fromName == thisTeam))
				{
					transfers.push({
						dateParsed:		dateParts.join('.'),
						timeStamp:		new Date(dateParts[2], dateParts[1] - 1, dateParts[2]),
						playerId:		link.attr('href').match(/id=([0-9]+)/)[1],
						playerLink:		link.attr('href'),
						playerName:		link.text(),
						playerValue:	children.eq(7).text(),
						amount:			children.eq(6).text(),
						toId:			toId,
						toLink:			to.attr('href'),
						toName:			to.text(),
						toLeagueId:		toLeague.length && toLeague.attr('href').match(/id=([0-9]+)/)[1],
						toLeagueLink:	toLeague.length && toLeague.attr('href'),
						toLeagueName:	toLeague.length && toLeague.text(),
						fromId:			fromId,
						fromLink:		from.attr('href'),
						fromName:		fromName,
						fromLeagueId:	fromLeague.attr('href').match(/id=([0-9]+)/)[1],
						fromLeagueLink:	fromLeague.attr('href'),
						fromLeagueName:	fromLeague.text()
					});
				}
			});
			
			if (typeof teams[index + 1] != 'undefined')
			{
				getTransfers(index + 1);
			}
			else
			{
				container = $('<table>').attr('class', 'statisticsGrid2').width('100%');
				
				container.append(
					'<tr id="transferHeadings">'
						+ '<td class="header">' + FPLang.get('league_transfers_h1') + '</td>'
						+ '<td class="header">' + FPLang.get('league_transfers_h2') + '</td>'
						+ '<td class="header">' + FPLang.get('league_transfers_h3') + '</td>'
						+ '<td class="header">' + FPLang.get('league_transfers_h4') + '</td>'
						//+ '<td class="header">' + FPLang.get('league_transfers_h5') + '</td>'
						+ '<td class="header">' + FPLang.get('league_transfers_h6') + '</td>'
						//+ '<td class="header">' + FPLang.get('league_transfers_h5') + '</td>' +
					+ '</tr>'
				);
				
				container.find('tr#transferHeadings td').css('padding', '4px 0px');
				
				// Sort them newest to oldest
				transfers.sort(function(a, b)
				{
					return b.timeStamp - a.timeStamp;
				});
				
				var max = 50,
					current = 0,
					bgcolor = '';
				
				for (var i in transfers)
				{
					bgcolor = bgcolor == '#F7F7F7' ? '#FFFFFF' : '#F7F7F7';
					
					t = transfers[i];
					
					container.append(
						$('<tr class="transferRow">').css('background-color', bgcolor).append(
							$('<td>').text(t.dateParsed)
						).append(
							$('<td>').append(
								$('<a>').attr('href', t.playerLink).text(t.playerName)
							)
						).append(
							$('<td>').text(t.amount)
						).append(
							$('<td>').append(
								$('<a>').attr('href', t.toLink).text(t.toName)
							)
						).append(
							$('<td>').append(
								$('<a>').attr('href', t.fromLink).text(t.fromName)
							)
						)
					);
					
					$('tr.transferRow td', container).css('padding', '6px 0px');
					
					// If the max limit has been reached, stop
					if (++current == max)
					{
						// Remove progress
						progress.remove();
						
						holder.append($('<h2>').html(FPLang.get('league_transfers') + '<br /><br />'));
						holder.append(container);
						
						return false;
					}
				}
				
				// Remove progress
				progress.remove();
				
				holder.append($('<h2>').text(FPLang.get('league_transfers')).append('<br /><br />'));
				holder.append(container);
			}
		}
		
		getTransfers(0);
	}
};