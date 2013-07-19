if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to dashboard.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //place holder how to get remote data such as the wifi router
    Meteor.http.get("http://www.turn.com", function (error, result) {
      console.log(result);
    });

    // code to run on server at startup
  });
}
