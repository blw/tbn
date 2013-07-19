if (Meteor.isClient) {

	Template.closeUpMode.userId = function() {
		return Session.get('userId');
	};

	Template.closeUpMode.creatives = function() {
		return Session.get('creatives');
	};

	Template.closeUpMode.tags = function() {
		return Session.get('tags');
	};

	Meteor.setTimeout(function() {
		console.log("inside creative wrapper close up");
		$('.creativesWrapper').animate({
			width: '60%'
		}, 2000, function() {
			console.log(Template.closeUpMode.creatives());
			if (Template.closeUpMode.creatives() && Template.closeUpMode.creatives().length > 0) {
				$('.creativesWrapper .boxLabel').show();
				var i = 0;
				var revealCreatives = Meteor.setInterval(function() {
					var creative = Template.closeUpMode.creatives()[i];
					$('#' + creative.id).show();
					i++;
					if (i > 6) {
						Meteor.clearInterval(revealCreatives);
					}
				}, 1000);
			}
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