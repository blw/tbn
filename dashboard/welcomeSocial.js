if (Meteor.isClient && document.location.pathname === "/welcomeSocialMode") {
    Meteor.call('getUserProfileData', function(error, data) {
    console.log(data);
        if (data) {
        userId1 = data.data.turnUserId;
        Session.set('userId1', userId1);
        var tags = [];
        var categories = data.data.categories;
        for (i = 0; i < categories.length; i++) {
          var start = categories[i].lastIndexOf('>');
          tags.push(categories[i].slice(start + 1));
        }
        Session.set('tags1', tags);
      }
    });

    Meteor.call('getUserProfileData', function(error, data) {
    console.log(data);
        if (data) {
        userId2 = data.data.turnUserId;
        Session.set('userId2', userId2);
        var tags = [];
        var categories = data.data.categories;
        for (i = 0; i < categories.length; i++) {
          var start = categories[i].lastIndexOf('>');
          tags.push(categories[i].slice(start + 1));
        }
        Session.set('tags2', tags);
      }
    });
    Template.welcomeSocialMode.userId1 = function() {
      var userId1 = Session.get("userId1");
      var tags1 = Session.get("tags1");
      sessionStorage.setItem("userId1", userId1);
      sessionStorage.setItem("tags1", JSON.stringify(tags1));
      console.log("session storage user Id 1: " + sessionStorage.getItem("userId1"));
      return userId1;
    }

    Template.welcomeSocialMode.userId2 = function() {
      var userId2 = Session.get("userId2");
      var tags2 = Session.get("tags2");
      sessionStorage.setItem("userId2", userId2);
      sessionStorage.setItem("tags2", JSON.stringify(tags2));
      console.log("session storage user Id 2: " + sessionStorage.getItem("userId2"));
      return userId2;
    }
    Meteor.setTimeout(function() {
      if (document.location.pathname !== "/socialMode") {
          document.location = "/socialMode";  
      } 
    }, 3000);
}

