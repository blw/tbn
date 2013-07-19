if (Meteor.isClient && document.location.pathname === "/closeUpMode") {

	Template.closeUpMode.userId = function() {
		return sessionStorage.getItem("userId");
	};

	Template.closeUpMode.creatives = function() {
		return JSON.parse(sessionStorage.getItem("creatives"));
	};

	Template.closeUpMode.tags = function() {
		return JSON.parse(sessionStorage.getItem("tags"));
	};

	Meteor.setTimeout(function() {
		console.log("inside creative wrapper close up");
		console.log(Template.closeUpMode.creatives());
		/*
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
		}*/
	}, 1000);

	/*Meteor.setTimeout(function() {
		$('.tag').show();
		$('.tags .boxLabel').show();
	}, 1000);*/
}