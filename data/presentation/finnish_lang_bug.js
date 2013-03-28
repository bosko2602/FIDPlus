// The player profile layout breaks when using the finnish language
// this module just reduces the sizes of the columns so they fit alongside each other
FP.Module.finnishLangBug =
{
	CoreModule:	true,
	Name:		'finnishLangBug',
	Pages:		['playerOtherSummary'],
	
	run: function()
	{
		if (FPLang.lang == 'Finnish')
		{
			FP.addStyleSheet('finnish_lang_bug');
		}
	}
};