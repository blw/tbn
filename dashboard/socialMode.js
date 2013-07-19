if (Meteor.isClient && document.location.pathname === "/socialMode") {
	console.log("session storage user Id 1: " + sessionStorage.getItem("tags1"));
	var tags1 = JSON.parse(sessionStorage.getItem("tags1"));
	var tags2 = JSON.parse(sessionStorage.getItem("tags2"));
	var tags1Index = tags1.indexOf(" Chief Household Officer");
	var tags2Index = tags2.indexOf(" Chief Household Officer");
	console.log("tag1index " + tags1Index);
	console.log("tag2index " + tags2Index);
	if (tags1Index >= 0) {
		tags1.splice(tags1Index, 1);
		tags1.push(" Household");
	}
	if (tags2Index >= 0) {
		tags2.splice(tags2Index, 1);
		tags2.push(" Household");
	}
	Template.socialMode.socialUsers = [
		{
			'userId':sessionStorage.getItem("userId1"),
			'interests':tags1
		},{
			'userId':sessionStorage.getItem("userId2"),
			'interests':tags2
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