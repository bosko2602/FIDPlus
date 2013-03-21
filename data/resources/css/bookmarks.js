FP.registerStyle('bookmarks', '\
\
	div.bookmarks-container \
	{ \
		background: rgba(0, 0, 0, .40); \
		border-bottom: 1px solid #777777; \
		border-left: 1px solid #777777; \
		position: fixed; \
		right: 0px; \
		top: 0px; \
		width: 200px; \
		z-index: 1000; \
		\
		-moz-border-radius-bottomleft: 6px; \
		border-bottom-left-radius: 6px; \
	} \
	\
	div.bookmarks-container div \
	{ \
		color: white; \
	} \
	\
	div.bookmarks-container div.title \
	{ \
		background: rgba(0, 0, 0, .35); \
		border-bottom-left-radius: 6px; \
		cursor: pointer; \
		font-weight: bold; \
		height: 15px; \
		padding: 5px 0px; \
		width: 100% \
	} \
	\
	div.bookmarks-container div.titleHover \
	{ \
		border-bottom-left-radius: 0px; \
	} \
	\
	div.bookmarks-container div.title div.right \
	{ \
		float: left; \
		/*width: 10%;*/ \
	} \
	\
	div.bookmarks-container div.title div.left \
	{ \
		float: left; \
		padding-left: 5px; \
		width: 85%; \
	} \
	\
	div.bookmarks-container div.list \
	{ \
		display: none; \
	} \
	\
	div.bookmarks-container div#help-text \
	{ \
		padding: 5px; \
	} \
	\
	div.bookmarks-container ul \
	{ \
		list-style-type: none; \
		margin: 0; \
		padding: 0px; \
		width: 100%; \
	} \
	\
	div.bookmarks-container ul li \
	{ \
		/*border-bottom: 1px solid #1f4a6f;*/ \
		color: #fffca0; \
		display: block; \
		list-style-type: none; \
		margin: 0; \
		list-style-type: none; \
	} \
	\
	div.bookmarks-container ul li > a \
	{ \
		color: #ffffff; \
		display: block; \
		margin: 0; \
		padding: 5px 5px; \
		text-decoration: none; \
	} \
	\
	div.bookmarks-container ul li > a:hover \
	{ \
		background: rgba(255, 255, 255, .10); \
		text-decoration: none; \
	} \
\
');