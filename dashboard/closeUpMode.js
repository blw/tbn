if (Meteor.isClient) {
	Template.closeUpMode.creatives = [
		{ id: 31823835, advertiser: 'Sprint' },
		{ id: 32371309, advertiser: 'Sprint' }, 
		{ id: 32346120, advertiser: 'Sprint' }
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