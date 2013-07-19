if (Meteor.isClient) {
	Template.socialMode.socialUsers = [
		{
			'userId':32432423,
			'interests':['Autos','Outdoors','Sports','Cooking']
		},{
			'userId':24209802,
			'interests':['Biking','Sailing','Sports','Golf']
		}
	];

	Template.socialMode.commonInterests = [];

	// Go through both users' lists and find ones that are the same
	(function() {
		var interests = {};
		var commonInterests = [];
		var i,j,lenI,lenJ;
		for(i = 0, lenI = Template.socialMode.socialUsers.length; i < lenI; i++) {
			for(j = 0, lenJ = Template.socialMode.socialUsers[i].interests.length; j < lenJ; j++) {
				if(interests[Template.socialMode.socialUsers[i].interests[j]] === true) {
					commonInterests.push(
						Template.socialMode.socialUsers[i].interests[j]
					);
				} else {
					interests[Template.socialMode.socialUsers[i].interests[j]] = true;
				}
			}
		}
		Template.socialMode.commonInterests = commonInterests;
	}());

	// After the common interests are found, go back and add 'common' to like-items of the users
	Meteor.setTimeout(function() {
		var i,len;
		for(i = 0, len = Template.socialMode.commonInterests.length; i < len; i++) {
			$('.interest[data-interest="'+Template.socialMode.commonInterests[i]+'"]').addClass('common');
		}
	}, 1000);
}