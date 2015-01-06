function runFP()
{
	FP.log('Run FP');
	
	// Set up language
	FPLang.init();
	
	changes = [];
	cssFiles = {};
	
	// Add global css
	FP.addStyleSheet('global');
	
	$.each(FP.Module, function(k, module)
	{
		if (module.CoreModule || FPPrefs.moduleEnabled(module))
		{
			if (module.init)
			{
				module.init();
			}
			
			if (module.Pages && module.run)
			{
				$.each(module.Pages, function(key, page)
				{
					// A bit messy I know
					if (
						page == 'all' ||
						(FP.isFid() && (page == 'fidAll' || FP.fidPages[page] == FP.pathname)) ||
						(FP.isForum() && (page == 'forumAll' || typeof FP.fidPages[page] != 'undefined' &&
							(FP.fidPages[page] == FP.queryObject.g || page == 'forumIndex' && typeof FP.queryObject.g == 'undefined')
						))
					)
					{
						if (module.change)
						{
							FP.log('Registering module change function for: ' + module.Name);
							
							changes.push(module);
						}
						
						if (module.Css)
						{
							FP.log('Registering module css for: ' + module.Name);
							
							$.each(module.Css, function(key, file)
							{
								if (typeof cssFiles[file] == 'undefined')
								{
									FP.addStyleSheet(file);
									
									// Make sure it doesnt get added more than once
									cssFiles[file] = true;
								}
							});
						}
						
						// Added catch so that one module breaking doesn't stop those that run after it.
						try
						{
							FP.log('Running module: ' + module.Name);
							
							module.run();
						}
						catch(e)
						{
							FP.log('Error: ' + e.message + ', in module: ' + module.Name);
						}
					}
				});
			}
		}
	});
	
	var target = FP.isFid() ? document.getElementById('aspnetForm') : document.getElementsByTagName('body')[0];
	
	var observer = new MutationObserver(function() {
		for (var module in changes) {
			changes[module].change();
		}
	});
	
	observer.observe(target, {
		childList: true,
		subtree: true
	});
}

function siteWait()
{
	// This is the footer of the site, meaning the main body has loaded
	if ($('.footer-container').length != 1)
	{
		setTimeout(siteWait, 25);
		return;
	}
	
	runFP();
	
	return true;
}

function forumWait()
{
	// This is the footer of the forum, meaning the main body has loaded
	if ($('div#panorama').length != 1)
	{
		setTimeout(forumWait, 25);
		return;
	}
	
	runFP();
	
	return true;
}

function chatNotify(e)
{
	if (e.target != this)
	{
		return true;
	}
	
	if ($('#tabtext').length > 0)
	{
		if (FP.Browser == 'chrome')
		{
			chrome.runtime.sendMessage({type: 'flashtitle'}, function(response){});
		}
		else
		{
			self.on('message', function(message)
			{
				if (message.type == 'playSound')
				{
					FP.playSound('notify.mp3');
				}
			});
			
			self.postMessage('flashTitle');
		}
	}
}

// ------------------------------------------

function setupFP()
{
	if ($.isEmptyObject(FPPrefs.prefs))
	{
		setTimeout(setupFP, 20);
		return;
	}
	
	// Is fidplus enabled?
	if (!FPPrefs.getPref('fidplusEnabled'))
	{
		return;
	}
	
	var url = window.location.href;
	var except = ['ChatBanner', 'Shared', 'FootballIdentity.aspx', 'LogOnAndPresentation'];
	var doRun = true;
	
	$.each(except, function()
	{
		if (url.indexOf(this) != -1)
		{
			doRun = false;
		}
	});

	if (doRun)
	{
		// Chat Alerts
		if (url.indexOf('chat.footballidentity.com') != -1)
		{
			if (FPPrefs.moduleEnabled(FP.Module.chatAlert))
			{
				$(function()
				{
					// New conversation
					$('.IMTabButtonPanel').live('DOMSubtreeModified', chatNotify);
					
					// New message from existing conversation
					$('.MessageList').live('DOMSubtreeModified', chatNotify);
				});
			}
		}
		
		// Forum Modules
		else if (FP.isForum())
		{
			forumWait();
		}
		
		// Site Modules
		else
		{
			siteWait();
		}
	}
}

setupFP();