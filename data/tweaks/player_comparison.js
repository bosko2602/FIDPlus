FP.Module.playerComparison =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'playerComparison',
	Pages: ['playerOtherSummary', 'playerOwnSummary'],
	Css: ['player_comparison', 'recent_players'],
	list: [],
	
	run: function()
	{
		this.list = FPPrefs.getPref('recentChars');
		this.playername = $('label#M_M_M_C_ctl00_labelName').text();
		this.playerid = $('img.uploadPhoto').attr('src').match(/id=([0-9]+)/)[1];
		this.playerage = $('span#M_M_M_C_C_C_labelAgeValue').text();
		this.playervalue = $(FP.isPage('playerOwnSummary') ? 'span#M_M_M_C_C_C_TransferValueValueLabel' : 'label#M_M_M_C_C_C_labelCurrentPlayerTransferValue').text();
		
		// Get player's skills
		var skills = FP.Helper.getSkills();
		
		var comparediv	= $('<div>').attr({'style': 'display: none', 'id': 'comparediv'});
		var holder		= $('<div>').attr('id', 'compareholder');
		var button		= $('<div>').addClass('fp-button compare').text('Compare');
		var list		= $('<div>').attr('id', 'playerlist');
		var select		= $('<select>');
		
		select.append('<option selected="selected">----------------------</option>');
		
		$.each(this.list, function(key, value)
		{
			select.append($('<option>').val(key).text(value.name));
		});
		
		select.change({'skills': skills}, this.show);
		
		list.text('Select a player to compare with:').append('<br /><br />');
		
		holder.append(list.append(select));
		comparediv.html(holder);
		
		button.openDOMWindow({
			eventType: 'click',
			overlayOpacity: 50,
			height: 50,
			width: 200,
			windowSourceID: '#comparediv'
		});
		
		button.click(function()
		{
			var domwindow = $('#DOMWindow');
			
			if (domwindow.length == 1)
			{
				domwindow.css('overflow', 'hidden');
				
				$('#container', domwindow).remove();
				$('#compareholder', domwindow).css('display', 'block');
				$('select option:first', domwindow).attr('selected', 'selected');
			}
		});
		
		$('div.site').append(comparediv);
		$('div.narrowRightColumn' + (FP.pathname == FP.fidPages['playerOwnSummary'] ? '' : 'Wider')).prepend(button);
		
		// Add to recent chars for next page reload
		this.addRecentChar(skills);
	},
	
	addRecentChar: function(skills)
	{
		// Put skills into their categories
		var physicals = [
			skills['Accel.'],
			skills['Agility'],
			skills['Balance'],
			skills['Jumping'],
			skills['Speed'],
			skills['Stamina'],
			skills['Strength']
		].join(';');
		
		var technicals = [
			skills['Ball Cont.'],
			skills['Blocking'],
			skills['Curving'],
			skills['Dribble'],
			skills['High Pas.'],
			skills['Low Pas.'],
			skills['One touch'],
			skills['Tackling']
		].join(';');
		
		var mentals = [
			skills['Anticipation'],
			skills['Def. Pos.'],
			skills['Fearl.'],
			skills['Scor. Pos.'],
			skills['Vision']
		].join(';');
		
		var finishing = [
			skills['Heading'],
			skills['Sh. Acc.'],
			skills['Shoot. Str.']
		].join(';');
		
		var keeper = [
			skills['Aerial Ab.'],
			skills['Handling'],
			skills['Keep. Pos.'],
			skills['P. w. Hands'],
			skills['Reflexes']
		].join(';');
		
		// Store it all in an object
		var data = {
			'id': this.playerid,
			'name': this.playername,
			'age': this.playerage,
			'value': this.playervalue,
			'position': FP.Helper.playerPos(),
			'physicals': physicals,
			'technicals': technicals,
			'mentals': mentals,
			'finishing': finishing,
			'keeper': keeper,
			'language': FPLang.lang,
			'isKeeper': FP.Helper.isKeeper()
		};
		
		var copy = this.list.slice(0);
		
		// Add to the beginning of the list (unshift is a strange function name...)
		copy.unshift(data);
		
		// Maximum list size is 15 players. So if the list is greater than this, remove the last one
		if (copy.length > 15)
		{
			copy.pop();
		}
		
		// Now save the list
		FPPrefs.setPref('recentChars', copy);
		
		return;
	},
	
	show: function(event)
	{
		var
			m = FP.Module.playerComparison,
			skills = event.data.skills,
			data = m.list[$('option:selected', this).val()],
			container = $('<div>').attr('id', 'container').width('100%'),
			types = {
				'physicals':	FPLang.get('compare_physical'),
				'technicals':	FPLang.get('compare_technical'),
				'mentals':		FPLang.get('compare_mental'),
				'keeper':		FPLang.get('compare_keeper'),
				'finishing':	FPLang.get('compare_finishing')
			},
			playerid = m.playerid,
			playername = m.playername,
			playervalue = m.playervalue,
			playerage = m.playerage,
			playerpos = FP.Helper.playerPos(),
			language = data.language;
		
		// Skill holders
		var
			graphSkills1 = [],
			graphSkills2 = [];
		
		var count = 0, floaty = '', bgcolor = '', totalSkills1 = 0, totalSkills2 = 0;
		
		$.each(types, function(category, header)
		{
			floaty = ++count % 2 == 0 ? 'right' : 'left';
			
			bgcolor = '';
			
			var html = $('<div class="attrholder">').css({'float': floaty, 'width': '49%'}).append
			(
				$('<div>').css({
					'border-top': '1px solid lightgrey',
					'border-left': '1px solid lightgrey',
					'border-right': '1px solid lightgrey',
					'height': '20px',
					'padding-top': '5px'
				}).append(
					$('<span>').css({'font-weight': 'bold', 'font-size': '12px', 'padding-left': '5px'}).text(header)
				)
			);
			
			var
				holder		= $('<div>').css('border', '1px solid lightgrey'),
				attributes	= data[category].split(';');
			
			$.each(attributes, function()
			{
				var
					split	= this.split(':'),
					text	= split[0],
					value	= parseFloat(split[1]),
					title	= split[2];
				
				var key = FPLang.skill(text, language);
					
				var
					Main		= skills[key].split(':'),
					text		= Main[0],
					valueMain	= parseFloat(Main[1]),
					titleMain	= Main[2];
				
				// Add to graph categories
				graphSkills1[key] = valueMain;
				graphSkills2[key] = value;
				
				totalSkills1 += valueMain;
				totalSkills2 += value;
				
				var width = (valueMain / (value + valueMain)) * 100;
				
				bgcolor = bgcolor == '#FAFAFA' ? '#EEEEEE' : '#FAFAFA';
				
				$(holder).append(
					$('<div>').css({'background-color': bgcolor, 'padding': '5px'}).append(
						$('<div>').css({'float': 'left', 'width': '40%'}).text(text)
					)
					.append(
						$('<div>').css({'float': 'right', 'height': '1px', 'width': '60%'}).append(
							$('<div>')
							.attr('title', FP.Helper.skillText(valueMain.toString()))
							.css({
								'-moz-border-radius-topleft': '3px',
								'border-top-left-radius': '3px',
								'-moz-border-radius-bottomleft': '3px',
								'border-bottom-left-radius': '3px',
								'background-color': '#046fbf',
								'color': 'white',
								'float': 'left',
								'text-align': 'center',
								'width': width + '%'
							})
							.text(titleMain)
						).append(
							$('<div>')
							.attr('title', FP.Helper.skillText(value.toString()))
							.css({
								'-moz-border-radius-topright': '3px',
								'border-top-right-radius': '3px',
								'-moz-border-radius-bottomright': '3px',
								'border-bottom-right-radius': '3px',
								'background-color': '#fe0003',
								'color': 'white',
								'float': 'left',
								'text-align': 'center',
								'width': (100 - width) + '%'
							})
							.text(title)
						).append(
							$('<div>').css({
								'color': '#444444',
								'line-height': '0px',
								'top': '-8px',
								'position': 'relative',
								'text-align': 'center',
								'z-index': 2
							}).text('|')
						)
					).append(
						'<div style="clear: both"></div>'
					)
				);
			});
			
			$(container).append($(html).append(holder));
			
			if (count % 2 == 0)
			{
				$(container).append('<div style="clear: both">&nbsp;</div>');
			}
		});
		
		// 700 is used as a base rating
		var totalSkillsWidth = ((totalSkills1 - 700) / ((totalSkills1 - 700) + (totalSkills2 - 700))) * 100;
		
		$('div.attrholder:first', container).before(
			$('<div>').append(
				$('<div>').css({'float': 'left', 'margin-top': '30px', 'width': '33.33%'}).append(
					$('<img>').attr('src', FP.Helper.imageUrl('character', playerid)).css({
						'-moz-border-radius': '5px',
						'border-radius': '5px',
						'border': '4px solid #046fbf',
						'float': 'left',
						'height': '80px',
						'width': '80px'
					})
				).append(
					$('<div>').css({'float': 'left', 'padding-left': '5px'}).append(
						$('<h3>').text(playername).css('margin-top', '0px')
					).append(
						'<div>Age: ' + playerage + '</div>' +
						'<div>Position: ' + playerpos + '</div>' +
						'<div>Value: ' + playervalue + '</div>'
					)
				)
			).append(
				$('<div>').addClass('attribute-graph-holder').css({'float': 'left', 'text-align': 'center', 'width': '33.33%'}).append(
					'<canvas id="comparison"></canvas>'
				)
			).append(
				$('<div>').css({'float': 'left', 'margin-top': '30px', 'width': '33.33%'}).append(
					$('<img>').attr('src', FP.Helper.imageUrl('character', data.id)).css({
						'-moz-border-radius': '5px',
						'border-radius': '5px',
						'border': '4px solid #fe0003',
						'float': 'right',
						'height': '80px',
						'width': '80px'
					})
				).append(
					$('<div>').css({'float': 'right', 'padding-right': '5px'}).append(
						$('<h3>').css('text-align', 'right').text(data.name).css('margin-top', '0px')
					).append(
						'<div style="text-align: right">Age: ' + data.age + '</div>' +
						'<div style="text-align: right">Position: ' + data.position + '</div>' +
						'<div style="text-align: right">Value: ' + data.value + '</div>'
					)
				)
			).append(
				$('<div style="clear: both"><br /><hr /></div>')
			).append(
				$('<div>').append(
					$('<div>').css({'float': 'left', 'width': '15%'}).text(FPLang.get('compare_total_skills'))
				).append(
					$('<div>').css({'float': 'right', 'width': '85%'}).append(
						$('<div>').append(
							$('<div>').css({
								'-moz-border-radius-topleft': '3px',
								'border-top-left-radius': '3px',
								'-moz-border-radius-bottomleft': '3px',
								'border-bottom-left-radius': '3px',
								'background-color': '#046fbf',
								'color': 'white',
								'float': 'left',
								'text-align': 'center',
								'width': totalSkillsWidth + '%',
								'z-index': 1
							})
							.text(totalSkills1.toFixed(2))
						).append(
							$('<div>').css({
								'-moz-border-radius-topright': '3px',
								'border-top-right-radius': '3px',
								'-moz-border-radius-bottomright': '3px',
								'border-bottom-right-radius': '3px',
								'background-color': '#fe0003',
								'color': 'white',
								'float': 'left',
								'text-align': 'center',
								'width': (100 - totalSkillsWidth) + '%',
								'z-index': 1
							})
							.text(totalSkills2.toFixed(2))
						)
					).append(
						$('<div>').css({
							'color': '#444444',
							'line-height': '0px',
							'top': '-8px',
							'position': 'relative',
							'text-align': 'center',
							'z-index': 2
						}).text('|')
					)
				)
			).append(
				$('<div style="clear: both">&nbsp;</div>')
			)
		);
		
		var comparediv = $('#DOMWindow'), canvas = $('canvas', container);
		
		comparediv.css('overflow', 'auto');
		$('#compareholder', comparediv).css('display', 'none');
		comparediv.width(window.innerWidth * 0.9).height(window.innerHeight * 0.9).append(container);
		
		// Added a function to the script to allow easy centering
		$.centerDOMWindow();
		
		// Show keeper graph?
		var keeper = FP.Helper.isKeeper() && data.isKeeper == true;
		
		if (keeper)
		{
			canvas.addClass('keeper');
		}
		
		// Calculate graph paths
		FP.Module.attributeAnalyser.draw(canvas, graphSkills1, keeper, 'blue');
		FP.Module.attributeAnalyser.draw(canvas, graphSkills2, keeper, '#fe0003');
		
		return;
	}
};