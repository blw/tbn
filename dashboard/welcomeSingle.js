if (Meteor.isClient && document.location.pathname === "/welcomeSingleMode") {
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

    Template.welcomeSingleMode.userId = function() {
      var userId = Session.get('userId');
      var creatives = Session.get('creatives');
      var tags = Session.get('tags');

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("creatives", JSON.stringify(creatives));
      sessionStorage.setItem("tags", JSON.stringify(tags));
      return Session.get('userId');
    };

    Meteor.setTimeout(function() {
      $(".signal").removeClass('none');
      Meteor.setTimeout(function() {
        $(".idcard").removeClass('none');
        $(".userInfo").animate({
          left: '-=1200'
        }, 3000, function() {
            if (document.location.pathname !== "/closeUpMode") {
              document.location = "/closeUpMode";  
            }
          // var logo = $(".logo");
          // logo.animate({
          //   "width": '200px',
          //   "height": '39px'
          // }, 3000);
          // logo.css({
          //   "float": "left",
          //   "overflow": "visible"
          // });
          // var userInfo = $(".userId");

          // $(".presenceDetected").remove();
          // $(".welcomeScreen").append(userInfo);

          // userInfo.css({
          //   "float": "right",
          //   "margin-right": "700px"
          // });
          // userInfo.animate({
          //   "margin-right" : "+30px",
          //   "margin-top" : "5px"
          // }, 3000, function () {
          //   if (document.location.pathname !== "/closeUpMode") {
          //     document.location = "/closeUpMode";  
          //   }
          // });

        // Animation complete.
          });
        }, 2000);
    }, 2000);
}

