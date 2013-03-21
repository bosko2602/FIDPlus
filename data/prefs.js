var FPPrefs =
{
	prefs: {},
	
	init: function()
	{
		this.prefs = {};
		
		if (FP.Browser == 'chrome')
		{
			if (FP.chromeContext() == 'background')
			{
				this.load(localStorage);
			}
			else
			{
				chrome.extension.sendRequest({type: 'getPrefs'}, function(response)
				{
					FPPrefs.load(response.prefs);
				});
			}
		}
		else
		{
			self.on('message', function(message)
			{
				if (message.type == 'loadPrefs')
				{
					FPPrefs.load(message.prefs);
				}
			});
			
			self.postMessage('loadPrefs');
		}
	},
	
	getPref: function(pref)
	{
		if (typeof(this.prefs[pref]) == 'undefined')
		{
			if (typeof this.defaultPrefs[pref] != 'undefined')
			{
				return this.defaultPrefs[pref];
			}
			else
			{
				return '';
			}
		}
		else
		{
			return this.prefs[pref];
		}
	},
	
	load: function(prefs)
	{
		for (var i in prefs)
		{
			this.prefs[i] = JSON.parse(prefs[i]);
		}
	},
	
	moduleEnabled: function(module)
	{
		if (typeof module == 'object')
		{
			var name = module.Name;
		}
		else
		{
			var name = module;
		}
		
		return this.getPref('module_' + name).enabled;
	},
	
	moduleOptionEnabled: function(module, option)
	{
		var prefs = this.getPref('module_' + module.Name);
		
		if (typeof(prefs.options) === 'object')
		{
			return prefs.options[option];
		}
	},
	
	save: function()
	{
		if (FP.Browser == 'chrome')
		{
			chrome.extension.sendRequest({type: 'setPrefs', prefs: this.prefs});
		}
		else
		{
			self.postMessage({type: 'setPrefs', prefs: this.prefs});
		}
	},
	
	setPref: function(pref, value)
	{
		console.log('Setting pref ' + pref + ' to ' + value);
		
		this.prefs[pref] = value;
		
		this.save();
	}
};