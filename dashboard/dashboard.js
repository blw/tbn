var queryInterval = 10000;
var routerEndpoint = "http://www.turn.com";
var profileEndpoint = "http://www.turn.com";


if (Meteor.isClient) {
  var detectDevices = Meteor.setInterval(function() {
    Meteor.call('getDeviceData', function(error, result) {
    var macAddressArray = [];
    if (result) {
      var data = result.data;
      for (macAddressVal in data) {
        if (data.hasOwnProperty(macAddressVal)) {
           if (data[macAddressVal].isClose) {
            macAddressArray.push(data[macAddressVal]);
          }
        }
      }
    }
    console.log(result);
    console.log("macAddress is " + macAddressArray);
    if (macAddressArray.length === 1) {
      Meteor.clearInterval(detectDevices);
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
          }, 3000);

        // Animation complete.
          });
        }, 2000);
      }, 2000);
    } else if (macAddressArray.length > 1) {
      Meteor.clearInterval(detectDevices);
      Meteor.Router.to("/social");
    }
    
    });
  }, 1000);
  

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
  Meteor.Router.add({
    '/welcomeSingle': 'welcomeSingle',
    '/social': 'welcomeSocial',
    '/closeUpMode': 'closeUpMode'
  });

  Template.body.helpers({
    layoutName: function() {
      console.log("meteor router page :" + Meteor.Router.page());
      switch (Meteor.Router.page()) {
        case 'welcomeSocial':
          return 'welcomeSocial';
        case 'closeUpMode':
          return 'closeUpMode';
        case 'welcomeSingle':
          return 'welcomeSingleMode'
        default:
          return 'welcome';
      }
    }
  });


  Template.welcome.userId = function() {
    return Session.get('userId');
  };
  Template.welcomeSocial.userId1 = "12345";
  Template.welcomeSocial.userId2 = "12345";
  
 
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
        getUserProfileData: function (macAddress) {
            return Meteor.http.get('http://app002.sjc2.turn.com:8000/r/mobileuser?mac='+macAddress);
        }, 
        getDeviceData: function () {
            return Meteor.http.get('http://ozan.turn.corp:3000/stats');
        }
    });



    // code to run on server at startup
  });
}
