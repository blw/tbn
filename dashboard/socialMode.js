if (Meteor.isClient) {
	Template.socialMode.socialUsers = [
		{
			'id':32432423,
			'interests':[{interest:'Autos'},{interest:'Outdoors'},{interest:'Sports'},{interest:'Cooking'}]
		},{
			'id':24209802,
			'interests':[{interest:'Biking'},{interest:'Sailing'},{interest:'Sports'},{interest:'Golf'}]
		}
	];

	Template.socialMode.commonInterest = 'Sports';

	Template.socialUser.isCommonInterest = function(interest) {
		return Template.socialMode.commonInterest === interest;
	};
}