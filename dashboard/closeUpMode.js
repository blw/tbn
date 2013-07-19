if (Meteor.isClient) {
	Template.closeUpMode.creatives = [
		{ id: 32160025, width: 320, height: 270, advertiser: 'Sprint' },
		{ id: 32160026, width: 320, height: 270, advertiser: 'Sprint' }, 
		{ id: 32160027, width: 320, height: 270, advertiser: 'Sprint' }
	];

	Template.closeUpMode.tags = [ 'autos', 'outdoors', 'sports', 'cooking'];

	Meteor.setTimeout(function() {
		$('.creativesWrapper').animate({
			width: '60%'
		}, 2000, function() {
			$('.creativesWrapper .boxLabel').show();
			var i = 0;
			var revealCreatives = Meteor.setInterval(function() {
				var creative = Template.closeUpMode.creatives[i];
				$('#' + creative.id).show();
				i++;
				if (i === Template.closeUpMode.creatives.length) {
					Meteor.clearInterval(revealCreatives);
				}
			}, 1000);
		});
	}, 1000);

	Meteor.setTimeout(function() {
		$('.tags').animate({
			width: '28%'
		}, 2000, function() {
			$('.tag').show();
			$('.tags .boxLabel').show();
		});
	}, 1000);
}