FP.Helper =
{
	CoreModule: true,
	Name: 'Helper',
	Pages: ['all'],
	
	run: function(){},
	
	currentCharId: function() {
		var $char = $('.character_selector_clickablediv .character_selector_selectedCharacter');
		
		return $char.attr('href').match(/sacId=([\d]+)/)[1]
	},
	
	forumLink: function(forum)
	{
		return 'http://forum.footballidentity.com/default.aspx?g=topics&f=' + forum;
	},
	
	fidLink: function(link, id)
	{
		if (typeof FP.fidPages[link] != 'undefined')
		{
			link = FP.fidPages[link];
		}
		
		var text = 'http://footballidentity.com/' + link;
		
		if (typeof id != 'undefined')
		{
			if (typeof id == 'object')
			{
				var first = true;
				
				for (var param in id)
				{
					if (first)
					{
						text = text + '?' + param + '=' + id[param];
						
						first = false;
					}
					else
					{
						text = text + '&' + param + '=' + id[param];
					}
				}
			}
			else
			{
				text = text + '?id=' + id;
			}
		}
		
		return text;
	},
	
	getSkills: function(justValue)
	{
		if (typeof justValue == 'undefined')
		{
			justValue = false;
		}
		
		var skills = {};
		
		if (FP.isPage('playerOwnSummary'))
		{
			$('table#M_C_gridAttributes tr[class != "groupRow"]').each(function()
			{
				var children = $(this).children();
				
				var text = children.first().find('span').directText();
				var value = children.eq(1).text().replace(',', '.');
				
				if (!justValue)
				{
					skills[FPLang.skill(text)] = text + ':' + value + ':' + parseFloat(value).toFixed(2);
				}
				else
				{
					skills[FPLang.skill(text)] = parseFloat(value);
				}
			});
		}
		else
		{
			$('table#M_C_gridViewAttributeLevels_DXMainTable tr[id *= "M_C_gridViewAttributeLevels_DXDataRow"]').each(function()
			{
				var children = $(this).children();
				
				var text = children.eq(1).text();
				var value = children.last().text();
				
				if (isNaN(value.replace(',', '.')))
				{
					if (!justValue)
					{
						skills[FPLang.skill(text)] = text + ':' + FP.Helper.skillValue(value) + ':' + value;
					}
					else
					{
						skills[FPLang.skill(text)] = FP.Helper.skillValue(value);
					}
				}
				else
				{
					value = value.replace(',', '.');
					
					if (!justValue)
					{
						skills[FPLang.skill(text)] = text + ':' + value + ':' + parseFloat(value).toFixed(2);
					}
					else
					{
						skills[FPLang.skill(text)] = parseFloat(value);
					}
				}
			});
		}
		
		return skills;
	},
	
	isKeeper: function()
	{
		return this.playerPos() == FPLang.get('gk_detection');
	},
	
	/*!
	 * Creates the html for an image to either a team or player logo.
	 *
	 * @param string type		- Either 'character' or 'team'.
	 * @param int id			- Character or team id.
	 * @param int dimensions	- Height & width of the image
	 * @return string			- The image html.
	 */
	makeImage: function(type, id, dimensions)
	{
		if (typeof dimensions == 'undefined')
		{
			dimensions = 40;
		}
		
		return '<img src="' + this.imageUrl(type, id) + '" style="width: ' + dimensions + 'px; height: ' + dimensions + 'px; padding: 0px" alt="" border="0" />';
	},
	
	makePlayerLink: function(id, text, decoration)
	{
		var url = this.fidLink(FP.fidPages['playerOtherSummary'], id);
		
		if (typeof text == 'undefined')
		{
			text = url;
		}
		
		if (typeof decoration == 'undefined')
		{
			decoration = 'none';
		}
		
		return '<a href="' + url + '" style="text-decoration: ' + decoration + ';">' + text + '</a>';
	},
	
	makeTeamLink: function(id, text, decoration)
	{
		var url = this.fidLink(FP.fidPages['teamOtherInfo'], id);
		
		if (typeof text == 'undefined')
		{
			text = url;
		}
		
		if (typeof decoration == 'undefined')
		{
			decoration = 'none';
		}
		
		return '<a href="' + url + '" style="text-decoration: ' + decoration + ';">' + text + '</a>';
	},
	
	menuItem: function(text, identifier)
	{
		if (typeof identifier == 'undefined')
		{
			var identifier = 'menuitem';
		}
		
		return $('<tr>').append($('<td>').append($('<span>')
			.attr('id', identifier)
			.css('cursor', 'pointer')
			.html(text)
			.hover(
				function()
				{
					$(this).css({
						'background-color': 'lightGrey',
						'border-color': '#CCCCCC',
						'border-width': '1px',
						'border-style': 'solid'
					});
				},
				function()
				{
					$(this).css({
						'background-color': 'white',
						'border-width': '0px'
					});
				}
			)
		));
	},
	
	imageUrl: function(type, id)
	{
		// Get yesterday's cached image
		var yDate = new Date();
		yDate.setDate(yDate.getDate() - 1);
		
		var cached = [yDate.getMonth() + 1, yDate.getDate(), yDate.getFullYear(), yDate.getHours(), yDate.getMinutes(), yDate.getSeconds()].join('_');
		
		return 'http://footballidentity.com/Shared/GetImage.ashx?type=' + type + '&id=' + id + '&cached=' + cached;
	},
	
	playerPos: function()
	{
		return $(FP.pathname == FP.fidPages['playerOwnSummary'] ? '#M_C_PlayerTypeValueLabel' : '#M_C_labelCharacterTypeValue').text();
	},
	
	skillColour: function(skill)
	{
		var levels = [20.99, 30.99, 40.99, 50.99, 60.99, 70.99, 80.99, 85.99, 90.99, 95.99, 100];
		var className = '';
		
		if (isNaN(skill.replace(',', '.')))
		{
			$.each(levels, function(key, value)
			{
				if (FP.Helper.skillValue(skill) <= value)
				{
					className = 'skill-level-' + key;
					return false;
				}
			});
		}
		else
		{
			skill = skill.replace(',', '.');
			
			$.each(levels, function(key, value)
			{
				if (skill <= value)
				{
					className = 'skill-level-' + key;
					return false;
				}
			});
		}
		
		return className;
	},
	
	/*!
	 * Translates skill values into their text representations.
	 *
	 * @param float val
	 * @return string
	 */
	skillText: function(val)
	{
		var skills = [
			{max: 20.99,	text: 'Disastrous'},
			{max: 30.99,	text: 'Useless'},
			{max: 40.99,	text: 'Very Poor'},
			{max: 50.99,	text: 'Poor'},
			{max: 60.99,	text: 'Mediocre'},
			{max: 70.99,	text: 'Means Business'},
			{max: 80.99,	text: 'Good'},
			{max: 85.99,	text: 'Very Good'},
			{max: 90.99,	text: 'Superb'},
			{max: 95.99,	text: 'Fantastic'},
			{max: 100,		text: 'Star Quality'}
		];
		
		var skill = '';
		
		$(skills).each(function()
		{
			if (val.replace(',', '.') <= this.max)
			{
				skill = FPLang.get(this.text);
				
				return false;
			}
		});
		
		return skill;
	},
	
	skillValue: function(text)
	{
		var texts = {};
		
		texts[FPLang.get('Disastrous')]		= 20;
		texts[FPLang.get('Useless')]		= 26;
		texts[FPLang.get('Very Poor')]		= 36;
		texts[FPLang.get('Poor')]			= 46;
		texts[FPLang.get('Mediocre')]		= 56;
		texts[FPLang.get('Means Business')]	= 66;
		texts[FPLang.get('Good')]			= 76;
		texts[FPLang.get('Very Good')]		= 83.5;
		texts[FPLang.get('Superb')]			= 88.5;
		texts[FPLang.get('Fantastic')]		= 93.5;
		texts[FPLang.get('Star Quality')]	= 100;
		
		return texts[text];
	}
};