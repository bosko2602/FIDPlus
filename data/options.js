function runOptions()
{
	if ($.isEmptyObject(FPPrefs.prefs))
	{
		setTimeout(runOptions, 20);
		return;
	}
	
	FPLang.init();
	
	$(function()
	{
		initSections();
		showText();
		links();
		initHandlers();
	});
}

function links()
{
	$('ul.navigation a').each(function()
	{
		$(this).click(function(e)
		{
			e.preventDefault();
			
			$('div#sections > div').hide();
			$('div#' + $(this).attr('id') + '_section').show();
		});
	});
}

function showText()
{
	$('[lang-var]').each(function()
	{
		$(this).html(FPLang.get($(this).attr('lang-var')));
	});
}

function initHandlers()
{
	$('input#save').click(function()
	{
		$('body [pref]').each(function()
		{
			if ($(this).is(':checkbox'))
			{
				FPPrefs.setPref($(this).attr('pref'), $(this).is(':checked'));
			}
			else if ($(this).is('select'))
			{
				FPPrefs.setPref($(this).attr('pref'), $(this).find('option:selected').val());
			}
		});
		
		$('div.module').each(function()
		{
			var data = {options: {}}, module = $(this).attr('id');
			
			$(this).find('input').each(function()
			{
				if ($(this).attr('option'))
				{
					data.options[$(this).attr('option')] = $(this).is(':checked');
				}
				else
				{
					data.enabled = $(this).is(':checked');
				}
			});
			
			FPPrefs.setPref('module_' + module, data);
		});
		
		// Save prefs, display notice
		FPPrefs.save();
		$('div.optionsupdated').toggle();
		
		setTimeout(
			function()
			{
				$('div.optionsupdated').slideToggle('slow');
			},
			2000
		);
	});
}

function initSections()
{
	initMainSection();
	initModuleSections();
	initAbout();
}

function initMainSection()
{
	// Enable/disable
	if (FPPrefs.getPref('fidplusEnabled'))
	{
		$('input#fidplusEnabled').attr('checked', 'checked');
	}
	
	// Language
	var langs = [], option;
	
	for (var i in FPLang.vars)
	{
		langs.push(i);
	}
	langs.sort(function(a, b)
	{
		return a.localeCompare(b);
	});
	
	$.each(langs, function()
	{
		text = this.toString();
		
		option = $('<option>').attr('value', text).text(text);
		
		if (text == FPPrefs.getPref('lang'))
		{
			option.attr('selected', 'selected');
		}
		
		$('select#lang').append(option);
	});
	
	// Version
	$('#fidplusversion').text(FPLang.get('options_main_version_desc').format(FP.Version));
}

function initAbout()
{
	var devs = [], trans = [], donators = [];
	
	$(FP.Data.Contributors.Developers).each(function()
	{
		devs.push(
			this.name +
			' (<a href="http://footballidentity.com/User/UserGeneral/U53.aspx?id=' + this.siteprofile + '">Site Profile</a> | ' +
			'<a href="http://forum.footballidentity.com/default.aspx?g=profile&u=' + this.forumprofile + '">Forum Profile</a>)'
		);
	});
	
	$(FP.Data.Contributors.Translators).each(function()
	{
		trans.push(
			this.lang + ', by ' + this.name +
			' (<a href="http://forum.footballidentity.com/default.aspx?g=profile&u=' + this.forumprofile + '">Forum Profile</a>)'
		);
	});
	
	$(FP.Data.Contributors.Donators).each(function()
	{
		donators.push(
			'<a href="http://footballidentity.com/User/UserGeneral/U53.aspx?id=' + this.siteprofile + '">' + this.name + '</a>'
		);
	});
	
	$('p#developers').html(devs.join('<br />'));
	$('p#translators').html(trans.join('<br />'));
	$('p#donators').html(donators.join('<br />'));
}

function initModuleSections()
{
	var sections =
	{
		'Tweaks':		[],
		'Presentation':	[],
		'Forum':		[]
	}
	
	for (var i in FP.Module)
	{
		if (FP.Module[i].Category)
		{
			sections[FP.Module[i].Category].push(i);
		}
	}
	
	for (var i in sections)
	{
		sections[i].sort(function(a, b)
		{
			atext = FPLang.get('options_module_' + a + '_heading');
			btext = FPLang.get('options_module_' + b + '_heading');
			
			return atext.localeCompare(btext);
		});
	}
	
	for (var i in sections)
	{
		var section = i.toString().toLowerCase(), div = $('div#' + section + '_section'), scrollable = $('<div>').attr('class', 'scrollable');
		
		div.append('<h2 lang-var="options_' + section + '_heading"></h2>');
		
		var count = sections[i].length;
		
		for (var j in sections[i])
		{
			scrollable.append(getModule(FP.Module[sections[i][j]]));
			
			if (parseInt(j) + 1 < count)
			{
				scrollable.append('<hr />');
			}
		}
		
		div.append(scrollable);
	}
}

function getModule(module)
{
	var
		holder = $('<div>').attr('class', 'module').attr('id', module.Name),
		check = $('<input>').attr('type', 'checkbox').attr('module', module.Name).attr('id', 'module_' + module.Name).val(1),
		label = $('<label>').attr('lang-var', 'options_module_' + module.Name + '_heading').attr('for', 'module_' + module.Name),
		desc = $('<p>').attr('lang-var', 'options_module_' + module.Name + '_desc');
	
	if (FPPrefs.moduleEnabled(module))
	{
		check.attr('checked', 'checked');
	}
	
	holder.append($('<h3>').append(check).append(label));
	holder.append(desc);
	
	if (module.Options)
	{
		$.each(module.Options, function()
		{
			var para = $('<p>'), checkopt = $('<input>').attr({
				'id': 'option_' + this.toString(),
				'type': 'checkbox',
				'option': this.toString()
			});
			
			if (FPPrefs.moduleOptionEnabled(module, this.toString()))
			{
				checkopt.attr('checked', 'checked');
			}
			
			para.append(checkopt);
			para.append($('<label>').attr('lang-var', 'options_module_' + module.Name + '_option_' + this.toString()).attr('for', 'option_' + this.toString()));
			
			holder.append(para);
		});
	}
	
	return holder;
}

(function()
{
	FP.init();
	FPPrefs.init();
	runOptions();
})();