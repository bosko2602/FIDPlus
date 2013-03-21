FP.Module.teamTrainingWarning =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'teamTrainingWarning',
	Pages: ['playerOwnTraining'],
	Css: ['team_training_warning'],
	
	run: function()
	{
		var	
			date	= new Date(),
			tt		= $('label#M_M_M_C_ctl00_nextTrainingControl_ASPxCallbackPanel1_labelNextTrainingValue').text().split('/');
			
		if (tt[0] == date.getDate() && tt[1] == date.getMonth() + 1)
		{
			// Sort out container height
			$('div#divBasicContentHolder').css('height', 'auto');
			
			$('div#M_M_M_C_C_C_headerPanel').prepend(
				'<div style="clear: both; height: 15px"></div>'
			).prepend(
				$('<div>').attr('class', 'warning-box').text(FPLang.get('team_training_warning'))
			);
		}
	}
};