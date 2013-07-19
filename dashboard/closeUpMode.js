if (Meteor.isClient) {
	Meteor.call('getUserProfileData', function(error, data) {
		console.log(data);
        if (data) {
        userId = data.data.turnUserId;
        Session.set('userId', userId);
        var adIds = data.data.adIds;
        var advertisers = data.data.advertisers;
        var creatives = [];
        var i;
        for (i = 0; i < adIds.length; i++) {
          creatives.push({
            id: adIds[i],
            advertiser: advertisers[i]
          });
        }
        Session.set('creatives', creatives);
        var tags = [];
        var categories = data.data.categories;
        for (i = 0; i < categories.length; i++) {
          var start = categories[i].lastIndexOf('>');
          tags.push(categories[i].slice(start + 1));
        }
        Session.set('tags', tags);
      }
});

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