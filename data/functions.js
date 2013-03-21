$.fn.reverse = [].reverse;

$.fn.toHtml = function()
{
	return $('<div>').append(this.clone()).remove().html();
}

// http://stackoverflow.com/questions/2626750/getting-the-direct-content-of-an-html-element-encapsulated-in-a-jquery-object
$.fn.directText = function()
{
	return this.contents().map(function(){ return this.nodeType == 3 ? this.nodeValue : '';}).get().join('');
};

// Exact contains
$.expr[':'].econtains = function(obj, index, meta, stack)
{
	return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
}

RegExp.quote = function(str)
{
	return str.replace(/([.?*+^$[\]\\(){}-])/g, "\\$1");
};

String.prototype.format = function()
{
	var formatted = this;
	
	$.each(arguments, function(num, param)
	{
		formatted = formatted.replace('{' + num + '}', param);
	});
	
	return formatted;
};

// http://stackoverflow.com/questions/202605/repeat-string-javascript
String.prototype.repeat = function(num)
{
	return new Array(isNaN(num) ? 1 : ++num).join(this);
}

String.prototype.limit = function(num)
{
	return this.length > num ? this.substr(0, num) + '...' : this;
}

String.prototype.getid = function(param)
{
	if (typeof param == 'undefined')
	{
		param = 'id';
	}
	
	var regex = new RegExp(param + '=([0-9]+)');
	
	return this.match(regex)[1];
}