if (Meteor.isClient) {
      Meteor.setTimeout(function() {
      $(".signal").removeClass('none');
      Meteor.setTimeout(function() {
        $(".idcard").removeClass('none');
        $(".userInfo").animate({
          left: '-=1200'
        }, 3000, function() {
          var logo = $(".logo");
          logo.animate({
            "width": '200px',
            "height": '39px'
          }, 3000);
          logo.css({
            "float": "left",
            "overflow": "visible"
          });
          var userInfo = $(".userId");

          $(".presenceDetected").remove();
          $(".welcomeScreen").append(userInfo);

          userInfo.css({
            "float": "right",
            "margin-right": "700px"
          });
          userInfo.animate({
            "margin-right" : "+30px",
            "margin-top" : "5px"
          }, 3000, function () {
            if (document.location.pathname !== "/closeUpMode") {
              document.location = "/closeUpMode";  
            }
          });

        // Animation complete.
          });
        }, 2000);
    }, 2000);
}

