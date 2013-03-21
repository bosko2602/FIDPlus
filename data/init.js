(function()
{
	// What page are we on?
	var currUrl		= window.location;
	var pathname	= currUrl.pathname.substring(1);
	var params		= currUrl.search.substring(1).split('&');

	FP.currUrl = currUrl.href;
	FP.pathname = pathname;

	var querystring = [], queryObject = {}, values;

	$(params).each(function(index, value)
	{
		values = value.split('=');
		
		querystring.push(values[1]);
		
		queryObject[values[0]] = values[1];
	});

	// Init fidplus holder
	FP.init(querystring, queryObject);

	// Setup preferences
	FPPrefs.init();
})();