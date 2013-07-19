var queryInterval = 10000;
var routerEndpoint = "http://www.turn.com";
var profileEndpoint = "http://www.turn.com";


if (Meteor.isClient) {
  Template.welcome.greeting = function () {
    return "Welcome to dashboard. ";
  };

  Template.welcome.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    
      Meteor.call("getUserProfileData", function (error, result) {
        console.log(result);
        Session.set("time", result);
      });
    }
  });

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        document.body.appendChild(Meteor.render(Template.test));
    }
}
  
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
