var START_DATE = new Date;
var START_TIME = START_DATE.getTime();

FP.init();
FPPrefs.init();

/** Team training intervals **/
var intervals = {};
var lastTTs = {};

if (FPPrefs.moduleEnabled('teamTrainingNotification'))
{
	var dates = FPPrefs.getPref('teamTrainingDate');
	
	for (var i in dates)
	{
		createInterval(i, dates[i]);
	}
}

function createInterval(i, info)
{
	console.log('checking interval ' + i + ' for ' + info.name);
	
	if (info.date != '')
	{
		var
			now		= new Date(),
			tt		= info.date.split('/'),
			part2	= tt[2].split(' '),
			ttyear	= part2[0],
			time	= part2[1].split(':'),
			ttdate	= new Date(ttyear, tt[1] - 1, tt[0], time[0], time[1], 0);
		
		if ((typeof lastTTs[i] == 'undefined' || lastTTs[i] < ttdate.getTime()) && ttdate.toDateString() == now.toDateString())
		{
			console.log('setting interval ' + i + ' for ' + info.name);
			
			var ttTime = ttdate.getTime();
			lastTTs[i] = ttTime;
			
			intervals[i] = setInterval(function()
			{
				console.log('run interval for ' + i);
				
				var now = new Date();
				
				if (now.getTime() >= ttTime && now.getTime() < (ttTime + 1800000))
				{
					console.log('show notification for ' + i);
					
					webkitNotifications.createNotification(
						'data/resources/images/icon_48.png',
						'FID Team Training',
						'It is team training time for ' + info.name
					).show();
					
					clearInterval(intervals[i]);
					delete intervals[i];
				}
				
			}, 60000);
		}
	}
}

// Chat Alert
var flashinterval = null;
var flashtab = 0;
var flash = true;
var pagetitle = '';

function flashTitle(tab, text)
{
	if (pagetitle == '')
	{
		pagetitle = tab.title;
	}
	
	chrome.tabs.executeScript(tab.id, {code: 'document.title = "' + (flash ? text : pagetitle) + '";'});
	
	flash = !flash;
	
	return;
}

// Toggle fidplus on/off by clicking icon
chrome.pageAction.onClicked.addListener(function(tab)
{
	if (FPPrefs.getPref('fidplusEnabled') == true)
	{
		var
			icon	= 'disabled',
			text	= 'FidPlus Disabled',
			enabled	= false;
	}
	else
	{
		var
			icon	= 'enabled',
			text	= 'FidPlus Enabled';
			enabled	= true;
	}
	
	chrome.tabs.getAllInWindow(null, function(tabs)
	{
		for (var i = 0; i < tabs.length; ++i)
		{
			if (tabs[i].url.indexOf('footballidentity.com') > -1)
			{
				chrome.pageAction.setIcon({tabId: tabs[i].id, path: 'data/resources/images/icon_' + icon + '.png'});
				chrome.pageAction.setTitle({tabId: tabs[i].id, title: text});
			}
		}
	});
	
	localStorage.fidplusEnabled = enabled;
	
	// Reload preferences
	FPPrefs.init();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse)
{
	// Request made, so we know we're on a fid page. Show fidplus icon
	if (FPPrefs.getPref('fidplusEnabled'))
	{
		var
			img		= 'enabled',
			title	= 'FidPlus Enabled';
	}
	else
	{
		var
			img		= 'disabled',
			title	= 'FidPlus Disabled';
	}
	
	chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'data/resources/images/icon_' + img + '.png'});
	chrome.pageAction.setTitle({tabId: sender.tab.id, title: title});
	chrome.pageAction.show(sender.tab.id);
	
	// Load preferences
	if (request.type == 'getPrefs')
	{
		if (localStorage.getItem('fidplusEnabled') == null)
		{
			// Set default preference
			sendResponse({prefs: {'fidplusEnabled': true}});
		}
		else
		{
			sendResponse({prefs: localStorage});
		}
	}
	// Saves preferences
	else if (request.type == 'setPrefs')
	{
		localStorage.clear();
		
		for (var i in request.prefs)
		{
			localStorage.setItem(i, JSON.stringify(request.prefs[i]));
		}
		
		// Reload preferences
		FPPrefs.init();
		
		sendResponse({});
	}
	else if (request.type == 'moduleEnabled')
	{
		sendResponse({enabled: FPPrefs.getPref('module_' + request.module).enabled});
	}
	else if (request.type == 'flashtitle')
	{
		chrome.tabs.getSelected(null, function(tab)
		{
			if (tab.id != sender.tab.id && flashinterval == null)
			{
				flashinterval = setInterval(function(){ flashTitle(sender.tab, 'New Message!'); }, 2000);
				
				FP.playSound('notify.mp3');
				
				flashtab = sender.tab.id;
			}
		});
		
		sendResponse({});
	}
	else if (request.type == 'hidechat')
	{
		chrome.tabs.executeScript(sender.tab.id, {code: 'HideMessengerPanel();'});
		
		sendResponse({});
	}
	else if (request.type == 'resetnotification')
	{
		clearInterval(intervals[request.player]);
		delete intervals[request.player];
		
		createInterval(request.player, request.info);
	}
	else
	{
		sendResponse({});
	}
});

chrome.tabs.onSelectionChanged.addListener(function(tabid, selectInfo)
{
	if (tabid == flashtab && flashinterval != null)
	{
		clearInterval(flashinterval);
		flashinterval = null;
		
		chrome.tabs.executeScript(tabid, {code: 'document.title = "' + pagetitle + '";'});
	}
});