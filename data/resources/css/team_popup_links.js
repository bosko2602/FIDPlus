FP.registerStyle('team_popup_links', ' \
\
	ul.team-popup-link \
	{ \
		display: none; \
		list-style-type: none; \
		margin: 0px; \
		padding: 0px; \
		position: absolute; \
		width: auto; \
		z-index: 50000; \
	} \
	\
	ul.team-popup-link li \
	{ \
		background-color: white; \
		border-left: 1px solid #DDDDDD; \
		border-right: 1px solid #DDDDDD; \
		border-bottom: 1px solid #DDDDDD; \
		line-height: 20px; \
		margin: 0px; \
		text-align: left; \
		white-space: nowrap; \
	} \
	\
	ul.team-popup-link li:not(.title):hover \
	{ \
		background-color: #F6F6F6; \
	} \
	\
	ul.team-popup-link li:last-child \
	{ \
		border-bottom-left-radius: 4px; \
		-moz-border-radius-bottomleft: 4px; \
		border-bottom-right-radius: 4px; \
		-moz-border-radius-bottomright: 4px; \
	} \
	\
	ul.team-popup-link li.title \
	{ \
		background-color: #FCFCFC; \
		border-top: 1px solid #DDDDDD; \
		color: #888888; \
		font-weight: bold; \
		padding: 2px 5px; \
		\
		border-top-left-radius: 4px; \
		-moz-border-radius-topleft: 4px; \
		border-top-right-radius: 4px; \
		-moz-border-radius-topright: 4px; \
	} \
	\
	ul.team-popup-link li.title img \
	{ \
		vertical-align: middle; \
	} \
	\
	ul.team-popup-link li a \
	{ \
		display: block; \
		padding: 0px 5px; \
		text-decoration: none; \
		white-space: nowrap; \
	} \
	\
	ul.team-popup-link li a:hover \
	{ \
		text-decoration: none; \
	} \
\
');