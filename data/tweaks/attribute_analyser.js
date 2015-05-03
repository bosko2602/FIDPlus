// Thanks to Football Manager for the inspiration for this :)
FP.Module.attributeAnalyser =
{
	Category: FP.moduleCategories.Tweaks,
	Name: 'attributeAnalyser',
	Pages: ['playerOtherSummary', 'playerOwnSummary'],
	Css: ['attribute_analyser'],
	
	run: function()
	{
		var $div = $('<div>').addClass('attribute-graph-holder'),
			$canvas = $('<canvas id="profile"></canvas>');
		
		$div.append($canvas);
		
		var $el = $('.baseColumnRightSubcolumn:first');
		
		// Move favourite teams & chars?
		var favourites = $('.favouriteCharTeamTriplet');
		
		if (favourites.length == 2)
		{
			var holder = $('<div>').css('clear', 'both');
			var t1 = favourites.eq(0);
			var t2 = favourites.eq(1);
			
			holder.append(t1.css({'float': 'left', 'margin-right': '34px'})).append(t2.css('float', 'left'));
			
			$el.after(holder);
		}
		
		// Get player skills
		var skills = FP.Helper.getSkills(true);
		
		// Add the canvas
		$el.append($div);
		
		var keeper = FP.Helper.isKeeper();
		
		if (keeper)
		{
			$canvas.addClass('keeper');
		}
		
		this.draw($canvas, skills, keeper);
	},
	
	calc: function(angle, length)
	{
		// Centre coordinates
		var cX = 93;
		var cY = 75;
		
		// Calculate x & y coordinates
		var angle = Math.PI * angle / 180;
		var x = cX + length * Math.sin(angle);
		var y = cY - length * Math.cos(angle);
		
		return [x, y];
	},
	
	draw: function(canvasObj, skills, keeper, colour)
	{
		if (keeper)
		{
			var categories = [
				skills['Keep. Pos.'] / 2,
				(skills['Agility'] + skills['Stamina'] + skills['Strength']) / 6,
				(skills['Accel.'] + skills['Speed']) / 4,
				(skills['Anticipation'] + skills['Fearl.']) / 4,
				skills['P. w. Hands'] / 2,
				skills['Handling'] / 2,
				skills['Aerial Ab.'] / 2,
				skills['Reflexes'] / 2,
			];
		}
		else
		{
			// Put into 1 of 8 categories, average out and scale down to 0-50
			var categories = [
				(skills['Blocking'] + skills['Tackling'] + skills['Def. Pos.']) / 6,
				(skills['Agility'] + skills['Stamina'] + skills['Strength']) / 6,
				(skills['Accel.'] + skills['Speed']) / 4,
				(skills['High Pas.'] + skills['Low Pas.'] + skills['Vision'] + (skills['Curving'] / 2)) / 7,
				(skills['Scor. Pos.'] + skills['Sh. Acc.'] + skills['Shoot. Str.'] + (skills['Curving'] / 2)) / 7,
				(skills['Ball Cont.'] + skills['Dribble'] + skills['One touch']) / 6,
				(skills['Balance'] + skills['Jumping'] + skills['Heading']) / 6,
				(skills['Anticipation'] + skills['Fearl.']) / 4
			];
		}
		
		var canvas = canvasObj.get(0);
		
		if (canvas.width != canvasObj.width())
		{
			canvas.width = canvasObj.width();
			canvas.height = canvasObj.height();
		}
		
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		
		// Starting angle
		var angle = 0;
		var xy = [];
		var first = [];
		var next = [];
		
		// Loop through each category
		$.each(categories, function(key, val)
		{
			if (key == 0)
			{
				first = FP.Module.attributeAnalyser.calc(angle, val);
				ctx.moveTo(first[0], first[1]);
			}
			
			if (key == 7)
			{
				// Join back to start
				ctx.lineTo(first[0], first[1]);
			}
			else
			{
				angle += 45;
				
				next = FP.Module.attributeAnalyser.calc(angle, categories[key + 1]);
				
				// Draw a line to the next point
				ctx.lineTo(next[0], next[1]);
				ctx.moveTo(next[0], next[1]);
			}
		});
		
		if (typeof colour != 'undefined')
		{
			ctx.strokeStyle = colour;
		}
		
		ctx.lineWidth = 1.25;
		
		// Close path and stroke it
		ctx.closePath();
		ctx.stroke();
		
		return true;
	}
};