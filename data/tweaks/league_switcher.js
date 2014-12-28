FP.Module.leagueSwitcher =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'leagueSwitcher',
	Pages: ['compOtherFixtures', 'compOtherTable', 'compOwnFixtures', 'compOwnTable'],
	
	run: function()
	{
		isTable			= FP.isPage(['compOtherTable', 'compOwnTable']);
		this.iso		= $('.leagueInfoLabel').last().text().split(' ')[2];
		this.leagueid	= $('a#M_InfoBlockContainer_ctl00_linkTeams').attr('href').getid('league');
		
		if (typeof FP.Data.leagues[this.iso] != 'undefined')
		{
			var cselect = $('<select>').css({'border': '1px solid grey', 'width': '120px'}).change(function()
			{
				FP.Module.leagueSwitcher.populate($(this).val());
			});
			
			var lselect = $('<select>').attr('id', 'fidPlusLeagueSwitch').css({'border': '1px solid grey', 'width': '120px'}).change(function()
			{
				var link = isTable ? 'compOtherTable' : 'compOtherFixtures';
				
				window.location = FP.Helper.fidLink(link, $(this).val());
			});
			
			this.switcher = lselect;
			
			$.each(FP.Data.leagues, function(iso, data)
			{
				var option = $('<option>').val(iso).text(data.fullname);
				
				if (iso == FP.Module.leagueSwitcher.iso)
				{
					option.attr('selected', 'selected');
				}
				
				cselect.append(option);
			});
			
			if (isTable)
			{
				// increase wall post colspan
				$('#M_C_LeagueTable_wallControl_Container').closest('td').attr('colspan', 4);
				
				// add drop-downs
				$('#M_C_LeagueTable_comboBoxSeasons_ET').parent().after($('<td>').append(lselect)).after($('<td>').append(cselect));
			}
			else
			{
				$('table#M_C_LeagueFixture_comboBoxSeasons_ET').parent().after($('<td>').append(lselect)).after($('<td>').append(cselect));
			}
			
			this.populate(this.iso);
		}
	},
	
	populate: function(iso)
	{
		// Empty
		this.switcher.empty();
		
		var groups = {}, isCurrent = false;
		
		$.each(FP.Data.leagues[iso].leagues, function(id, vals)
		{
			if (typeof(groups[vals.tier]) == 'undefined')
			{
				groups[vals.tier] = $('<optgroup>').attr('label', FPLang.get('league_tier').format(vals.tier));
			}
			
			option = $('<option>').attr('value', id).text(vals.name);
			
			if (id == FP.Module.leagueSwitcher.leagueid)
			{
				isCurrent = true;
				option.attr('selected', 'selected');
			}
			
			groups[vals.tier].append(option);
		});
		
		if (!isCurrent)
		{
			this.switcher.append($('<option>').text('Select a League...'));
		}
		
		for (var i in groups)
		{
			this.switcher.append(groups[i]);
		}
	}
};