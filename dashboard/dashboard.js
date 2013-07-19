var queryInterval = 10000;
var routerEndpoint = "http://www.turn.com";
var profileEndpoint = "http://www.turn.com";


if (Meteor.isClient) {
  Meteor.Router.add({
    '/': 'welcome',
    '/social': 'welcomeSocial'
  });

  Template.body.helpers({
    layoutName: function() {
      console.log("meteor router page :" + Meteor.Router.page());
      switch (Meteor.Router.page()) {
        case 'welcomeSocial':
          return 'welcomeSocial';
        default:
          return 'welcome';
      }
    }
  });


  Template.welcome.userId = "12333333";
  Template.welcomeSocial.userId1 = "12345";
  Template.welcomeSocial.userId2 = "12345";

  Meteor.setTimeout(function() {
    $(".signal").removeClass('none');
    Meteor.setTimeout(function() {
      $(".idcard").removeClass('none');
      $(".userInfo").animate({
        left: '-=1200'
      }, 3000)
    }, 2000);
  }, 2000);
 
  // Template.welcome.events({
  //   'click input' : function () {
  //     // template data, if any, is available in 'this'
  //     if (typeof console !== 'undefined')
  //       console.log("You pressed the button");
    
  //     Meteor.call("getUserProfileData", function (error, result) {
  //       console.log(result);
  //       Session.set("time", result);
  //     });
  //   }
  // });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //place holder how to get remote data such as the wifi router
    // Meteor.setInterval(function() {
    //   Meteor.http.get(routerEndpoint, function (error, result) {
    //     var parsedMacAddresses = [];
    //     console.log(result);
    //   });
    // }, queryInterval);


    Meteor.methods({
        getUserProfileData: function () {
            var _time = (new Date).toTimeString();
            console.log(_time);
            return closeUpData;
        }
    });

    // code to run on server at startup
  });
}
