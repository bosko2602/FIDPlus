FP.Module.playerSkillTitles =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'playerSkillTitles',
	Pages: ['playerOtherSummary', 'playerOwnSummary'],
	Css: ['skill_descriptions'],
	
	run: function()
	{
		var count = 1;
		
		$('td.cellLeft').each(function()
		{
			if (count++ % 2 == 0)
			{
				if (FP.isPage('playerOwnSummary'))
				{
					$(this).attr('title', FP.Helper.skillText($(this).text()));
				}
			}
			else if (FP.isPage('playerOtherSummary'))
			{
				skill = FPLang.skill($(this).text());
				
				$('div.site').append(
					$('<div>').attr('id', 'skill-desc-' + skill.split(' ').join('')).addClass('skill-desc').text(FPLang.get(skill + '_desc'))
				);
				
				$(this).hover(function(event)
				{
					// Remove spaces and escape .'s
					var text = FPLang.skill($(this).text()).split(' ').join('').replace(/(:|\.)/g, '\\$1');
					
					var offset = $(this).parent().offset();
					var el = $('#skill-desc-' + text);
					
					el.css({'top': offset.top, 'left': offset.left - (el.offset().left + el.outerWidth())}).toggle();
				});
				
				$(this).attr('title', '');
			}
		});
	}
};