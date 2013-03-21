FPLang =
{
	lang: '',
	vars: {},
	
	init: function()
	{
		//if (FPPrefs.getPref('lang') == '' && FP.isFid())
		//{
			var fidlang = $.trim($('ul.settings-menu span.top-menu-item').text().split(':')[1]);
			var lang = typeof this.vars[fidlang] == 'undefined' ? 'English' : fidlang;
			
			//FPPrefs.setPref('lang', lang);
			this.lang = lang;
		//}
		//else
		//{
			//this.lang = FPPrefs.getPref('lang');
		//}
	},
	
	addLang: function(name, localeName, strings)
	{
		this.vars[name] = strings;
	},
	
	get: function(text)
	{
		if (typeof this.vars[this.lang][text] == 'undefined')
		{
			return this.vars.English[text];
		}
		
		return this.vars[this.lang][text];
	},
	
	skill: function(text, lang)
	{
		if (typeof lang == 'undefined')
		{
			lang = this.lang;
		}
		
		if (typeof this.vars[lang].skills[text] == 'undefined')
		{
			return this.vars.English.skills[text];
		}
		
		return this.vars[lang].skills[text];
	}
};