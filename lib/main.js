const data = require('sdk/self').data;
const pageMod = require('sdk/page-mod');
const tabs = require('sdk/tabs');
const timers = require('sdk/timers');
const notifications = require('sdk/notifications');

var prefs = require('sdk/simple-storage').storage;

if (typeof prefs.fidplusEnabled == 'undefined')
{
	prefs.fidplusEnabled = true;
}

var intervals = {};
var lastTTs = {};
var flashinterval = null;
var pagetitle = '';

// Run page scripts
pageMod.PageMod({
	include: [
		'http://footballidentity.com/*',
		'http://www.footballidentity.com/*',
		'http://forum.footballidentity.com/*',
		'http://chat.footballidentity.com/CuteSoft_Client/CuteChat/CuteMessenger.aspx'
	],
	contentScriptWhen: 'start',
	contentScriptFile: [
		data.url('library/jquery-1.7.1.min.js'),
		data.url('fidplus.js'),
		data.url('fidpages.js'),
		data.url('functions.js'),
		data.url('helper.js'),
		data.url('lang.js'),
		data.url('prefs.js'),
		data.url('prefsdefault.js'),
		data.url('init.js'),
		data.url('data/contributors.js'),
		data.url('data/league_forums.js'),
		data.url('data/leagues.js'),
		data.url('library/domwindow.js'),
		data.url('library/cookie.js'),
		data.url('library/moment.min.js'),
		data.url('locales/chinese.js'),
		data.url('locales/dutch.js'),
		data.url('locales/english.js'),
		data.url('locales/finnish.js'),
		data.url('locales/french.js'),
		data.url('locales/german.js'),
		data.url('locales/greek.js'),
		data.url('locales/hebrew.js'),
		data.url('locales/indonesian.js'),
		data.url('locales/italian.js'),
		data.url('locales/portuguese_br.js'),
		data.url('locales/portuguese_pt.js'),
		data.url('locales/polish.js'),
		data.url('locales/russian.js'),
		data.url('locales/serbian.js'),
		data.url('locales/spanish.js'),
		data.url('locales/swedish.js'),
		data.url('locales/turkish.js'),
		data.url('tweaks/bookmarks.js'),
		data.url('forum/sort_online.js'),
		data.url('forum/highlight_users.js'),
		data.url('presentation/extra_buttons.js'),
		data.url('presentation/finnish_lang_bug.js'),
		data.url('presentation/font_change.js'),
		data.url('presentation/limit_team_names.js'),
		data.url('presentation/manager_league_link.js'),
		data.url('presentation/move_character_guide.js'),
		data.url('presentation/move_keeper_skills.js'),
		data.url('presentation/team_players_avatars.js'),
		data.url('presentation/player_skill_titles.js'),
		data.url('presentation/team_training_warning.js'),
		data.url('presentation/training_status.js'),
		data.url('tweaks/attribute_analyser.js'),
		data.url('tweaks/chat_alert.js'),
		data.url('tweaks/league_forum.js'),
		data.url('tweaks/league_switcher.js'),
		data.url('tweaks/league_transfers.js'),
		data.url('tweaks/player_comparison.js'),
		data.url('tweaks/player_stats_total.js'),
		data.url('tweaks/qprreds_joke.js'),
		data.url('tweaks/team_count_players.js'),
		data.url('tweaks/team_fixtures.js'),
		data.url('tweaks/team_founded.js'),
		data.url('tweaks/team_popup_links.js'),
		data.url('tweaks/team_training_notification.js'),
		data.url('resources/css/attribute_analyser.js'),
		data.url('resources/css/bookmarks.js'),
		data.url('resources/css/finnish_lang_bug.js'),
		data.url('resources/css/font_change.js'),
		data.url('resources/css/forum_staff_highlight.js'),
		data.url('resources/css/global.js'),
		data.url('resources/css/player_comparison.js'),
		data.url('resources/css/recent_players.js'),
		data.url('resources/css/skill_descriptions.js'),
		data.url('resources/css/team_popup_links.js'),
		data.url('resources/css/team_training_warning.js'),
		data.url('resources/css/training_status.js'),
		data.url('run.js')
	],
	onAttach: function(worker)
	{
		worker.on('message', function(message)
		{
			handleMessage(message, worker);
		});
	}
});

// Fidplus icon
require('sdk/ui').ActionButton({
	id: 'fidplus-icon', 
	label: 'FidPlus',
	icon: data.url('resources/images/icon_' + (prefs.fidplusEnabled ? 'enabled' : 'disabled') + '.png'),
	onClick: function() {
		openSettings();
	}
});

// Settings page
function openSettings()
{
	tabs.open({
		url: data.url('options_firefox.html'),
		onReady: function(tab)
		{
			tab.attach({
				contentScriptFile: [
					data.url('library/jquery-1.7.1.min.js'),
					data.url('functions.js'),
					data.url('fidplus.js'),
					data.url('lang.js'),
					data.url('prefs.js'),
					data.url('prefsdefault.js'),
					data.url('data/contributors.js'),
					data.url('locales/english.js'),
					data.url('tweaks/bookmarks.js'),
					data.url('forum/sort_online.js'),
					data.url('forum/highlight_users.js'),
					data.url('presentation/extra_buttons.js'),
					data.url('presentation/finnish_lang_bug.js'),
					data.url('presentation/font_change.js'),
					data.url('presentation/limit_team_names.js'),
					data.url('presentation/manager_league_link.js'),
					data.url('presentation/move_character_guide.js'),
					data.url('presentation/move_keeper_skills.js'),
					data.url('presentation/team_players_avatars.js'),
					data.url('presentation/player_skill_titles.js'),
					data.url('presentation/team_training_warning.js'),
					data.url('presentation/training_status.js'),
					data.url('tweaks/attribute_analyser.js'),
					data.url('tweaks/chat_alert.js'),
					data.url('tweaks/league_forum.js'),
					data.url('tweaks/league_switcher.js'),
					data.url('tweaks/league_transfers.js'),
					data.url('tweaks/player_comparison.js'),
					data.url('tweaks/player_stats_total.js'),
					data.url('tweaks/qprreds_joke.js'),
					data.url('tweaks/team_count_players.js'),
					data.url('tweaks/team_fixtures.js'),
					data.url('tweaks/team_founded.js'),
					data.url('tweaks/team_popup_links.js'),
					data.url('options.js')
				],
				onMessage: function(message)
				{
					handleMessage(message, this);
				}
			});
		}
	});
}

// Message handler
function handleMessage(message, target)
{
	var resp = {};
	
	if (message.responseKey){
		resp.responseKey = message.responseKey;
	}
	
	if (message == 'getDir')
	{
		resp.type = 'getDir';
		resp.dir = data.url('');
		
		target.postMessage(resp);
	}
	else if (message == 'flashTitle')
	{
		if (target.tab != tabs.activeTab && flashinterval == null)
		{
			resp.type = 'playSound';
			
			target.postMessage(resp);
			
			flashinterval = timers.setInterval(function(){ flashTitle(target.tab, 'New Message!'); }, 2000);
		}
	}
	else if (message.type == 'getPrefs')
	{
		resp.type = 'getPrefs';
		resp.prefs = prefs;
		
		target.postMessage(resp);
	}
	else if (message.type == 'setPrefs')
	{
		for (var i in message.prefs)
		{
			prefs[i] = JSON.stringify(message.prefs[i]);
		}
	}
	else if (message.type == 'resetnotification')
	{
		timers.clearInterval(intervals[message.player]);
		delete intervals[message.player];
		
		createInterval(message.player, message.info);
	}
}

// Team training notifications
if (typeof prefs['module_teamTrainingNotification'] != 'undefined' && prefs['module_teamTrainingNotification'].enabled)
{
	var dates = prefs.teamTrainingDate;
	
	for (var i in dates)
	{
		try
		{
			createInterval(i, dates[i]);
		}
		catch (e) {}
	}
}

function createInterval(i, info)
{
	console.log('checking interval ' + i + ' for ' + info.name);
	
	if (info.date != '')
	{
		var now		= new Date(),
			ttdate	= new Date(info.date);
		
		if ((typeof lastTTs[i] == 'undefined' || lastTTs[i] <= ttdate.getTime()) && ttdate.toDateString() == now.toDateString())
		{
			console.log('setting interval ' + i + ' for ' + info.name);
			
			var ttTime = ttdate.getTime();
			lastTTs[i] = ttTime;
			
			intervals[i] = timers.setInterval(function()
			{
				console.log('run interval for ' + i);
				
				var now = new Date();
				
				if (now.getTime() >= ttTime && now.getTime() < (ttTime + 1800000))
				{
					console.log('show notification for ' + i);
					
					notifications.notify({
						title: 'FID Team Training',
						text: 'It is team training time for ' + info.name,
						iconURL: data.url('resources/images/icon_48.png')
					});
					
					timers.clearInterval(intervals[i]);
					delete intervals[i];
				}
				
			}, 60000);
		}
	}
}

// Flash tab title on new chat message
function flashTitle(tab, message)
{
	if (tab == tabs.activeTab)
	{
		timers.clearInterval(flashinterval);
		flashinterval = null;
		
		tab.title = pagetitle;
		pagetitle = '';
		
		return;
	}
	
	if (pagetitle == '')
	{
		pagetitle = tab.title;
	}
	
	tab.title = (tab.title == message ? pagetitle : message);
}