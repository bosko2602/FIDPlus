FP.Module.teamTrainingWarning =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'teamTrainingWarning',
	Pages: ['playerOwnSummary', 'playerOwnTraining'],
	Css: ['team_training_warning'],
	
	run: function() {
		var now = moment(),
			tt = FP.parseDate($('.teamTrainingDateLabel').text());
		
		this.ttDay = tt.isSame(now, 'day');
		
		this.$warning = $('<div>')
			.attr('class', 'warning-box')
			.text(FPLang.get('team_training_warning'));
		
		if (this.ttDay) {
			$('div#M_C_headerPanel')
				.prepend('<div style="clear: both; height: 15px"></div>')
				.prepend(this.$warning);
		}
	},
	
	change: function (mutations) {
		if (!this.ttDay || !FP.isPage('playerOwnSummary')) {
			return;
		}
		
		var self = this;
		
		mutations.forEach(function (mutation) {
			var $el = $(mutation.addedNodes[0]);
			
			if (!$el.find('#M_C_popupAttribute_popup_Div1').length) {
				return;
			}
			
			$el.find('td').first().prepend(self.$warning);
		});
	}
};