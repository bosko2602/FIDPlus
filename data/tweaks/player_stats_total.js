FP.Module.playerStatsTotal =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'playerStatsTotal',
	Pages: ['playerOtherStats', 'playerOwnStats'],
	
	run: function()
	{
		var
			rows	= $('tr[id *= M_C_Statistics_gridViewData_DXDataRow]'),
			cells	= [],
			columns;
		
		$.each(rows, function()
		{
			columns = $(this).children();
			
			for (i = 3; i <= columns.length - 1; ++i)
			{
				if (typeof cells[i] == 'undefined')
				{
					cells[i] = {'type': '', 'value': 0};
				}
				
				text = columns.eq(i).text();
				
				if (text == '-')
				{
					text = 0;
				}
				else if (text.indexOf('%') != -1)
				{
					text = text.replace('%', '') * columns.eq(3).text();
					
					cells[i]['type'] = 'percent';
				}
				else if (text.indexOf('.') != -1)
				{
					text = text * columns.eq(3).text();
					
					cells[i]['type'] = 'float';
				}
				
				cells[i]['value'] += parseFloat(text);
			}
		});
		
		var holder = rows.last().attr('class').indexOf('alternativeRow') != -1 ? $('<tr class="grey">') : $('<tr class="grey alternativeRow">');
		
		holder.append('<td></td><td></td><td></td>');
		
		$.each(cells, function(key, value)
		{
			if (key >= 3)
			{
				switch (value['type'])
				{
					case 'float':
						text = (value['value'] / cells[3]['value']).toFixed(1);
						break;
					
					case 'percent':
						text = (value['value'] / cells[3]['value']).toFixed(0) + '%';
						break;
					
					default:
						text = value['value'];
						break;
				}
				
				holder.append('<td class="cell dxgv" style="font-weight: bold">' + text + '</td>');
			}
		});
		
		rows.last().after(holder);
	}
};