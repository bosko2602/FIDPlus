FP.Module.trainingStatus =
{
	Category: FP.moduleCategories.Presentation,
	Name: 'trainingStatus',
	Pages: ['fidAll'],
	Css: ['training_status'],
	
	init: function() {
		this.currentChar = FP.Helper.currentCharId();
		this.lastTrained = FPPrefs.getPref('lastTrained');
	},
	
	run: function() {
		var self = this,
			$dropDown = $('.character_selector_clickablediv'),
			$characters = $dropDown.find('.character_selector_selectedCharacter, .characterSelector_ListItem:not(.chracterSelector_AddSlotItem)');
		
		var today = new Date();
		today.setHours(0, 0, 0);
		today.setMilliseconds(0);
		
		var now = new Date();
		
		$characters.each(function (i, character) {
			var $character = $(character),
				attr = $character.attr($character.hasClass('character_selector_selectedCharacter') ? 'href' : 'onclick'),
				id = attr.match(/sacId=([\d]+)/)[1];
			
			if (attr.indexOf('Manager') > -1) {
				return;
			}
			
			$character.find('.characterSelector_dropdown').remove();
			
			var $status = $('<div class="training-status"></div>');
			$character.find('.character_selector_characterInfo').after($status);
			
			if (self.lastTrained[id]) {
				self.lastTrained[id] = new Date(self.lastTrained[id]);
			}
			
			if (id == self.currentChar &&
				(!self.lastTrained[id] || self.lastTrained[id] < today) &&
				FP.isPage(['playerOwnSummary', 'playerOwnTraining'])) {
				if (self.checkTrained()) {
					self.lastTrained[id] = now;
				}
			}
			
			if (!self.lastTrained[id] || isNaN(self.lastTrained[id].getTime())) {
				delete self.lastTrained[id];
				return;
			}
			
			if (self.lastTrained[id] >= today) {
				$status.addClass('trained');
			}
		});
		
		this.save(this.lastTrained);
	},
	
	checkTrained: function() {
		if (FP.isPage('playerOwnSummary')) {
			return $('#M_C_gridAttributes .train-item.showAsLink').length == 0;
		}
		
		return $('#M_C_headerPanel_trainType').length == 0;
	},
	
	save: function(dates) {
		var toSave = {};
		
		for (var i in dates) {
			toSave[i] = dates[i].toString();
		}
		
		FPPrefs.setPref('lastTrained', toSave);
	}
};