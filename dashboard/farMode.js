if (Meteor.isClient) {
	Meteor.setInterval(function(){ 
		Meteor.call('getQPS', function(error, data) {
			if (data) {
				var qps = JSON.parse(data.content).qps[0].toFixed();
				Session.set('qps', qps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			}
		});
	}, 500);

	Template.farMode.userId = function() {
		return Session.get('userId');
	};

	Template.farMode.qps = function() {
		return Session.get('qps');
	};
}