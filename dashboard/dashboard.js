var POLLING_INTERVAL = 300;

var queryInterval = 10000;
var routerEndpoint = "http://www.turn.com";
var profileEndpoint = "http://www.turn.com";


if (Meteor.isClient) {
  var devices = {};
  var currentDeviceCount = 0;
  var currentCloseDeviceCount = 0;

  var devicePoller = Meteor.setInterval(function() {
    Meteor.call('getDeviceData', function(error, result) {
      if (result){
        devices = result.data;
        var addresses = Object.keys(devices);
        
        var closeAddresses = addresses.filter(function(address){

          return devices[address].isClose;
        });

        var prevDeviceCount = currentDeviceCount;
        var prevCloseDeviceCount = currentCloseDeviceCount;
        
        currentDeviceCount = addresses.length;
        currentCloseDeviceCount = closeAddresses.length;

        if(addresses.length !== prevDeviceCount || closeAddresses.length !== prevCloseDeviceCount){
          devicesChangedHandler();
        }
      }
    });
  }, POLLING_INTERVAL);


  function devicesChangedHandler(){
    console.log('Far devices:', (currentDeviceCount - currentCloseDeviceCount), 'Close devices: ', currentCloseDeviceCount);
    if(currentCloseDeviceCount === 0){
      farModeHandler();
    } else {
      closeModeHandler();
    }
  }

  function closeModeHandler(){
    if(currentCloseDeviceCount === 1){
      singleCloseModeHandler();
    } else {
      multiCloseModeHandler();
    }
  }

  function farModeHandler(){
    console.log('GOING TO FAR MODE!');
    if (document.location.pathname !== "/farMode") {
      document.location = "/farMode";  
    }
    
  }

  function singleCloseModeHandler(){
    console.log('GOING TO SINGLE CLOSE MODE!');
    if (document.location.pathname !== "/welcomeSingleMode" && document.location.pathname !== "/closeUpMode") {
      document.location = "/welcomeSingleMode";  
    }
  }

  function multiCloseModeHandler(){
    console.log('GOING TO MULTI CLOSE MODE!');
    if (document.location.pathname !== "/welcomeSocialMode" && document.location.pathname !== "/socialMode") {
      console.log(document.location.pathname);
      document.location = "/welcomeSocialMode";  
    }
  }
  
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
    '/welcomeSingleMode': 'welcomeSingleMode',
    '/welcomeSocialMode': 'welcomeSocialMode',
    '/socialMode' : 'socialMode',
    '/closeUpMode': 'closeUpMode',
    '/farMode': 'farMode'
  });

  Template.body.helpers({
    layoutName: function() {
      console.log("meteor router page :" + Meteor.Router.page());
      switch (Meteor.Router.page()) {
        case 'welcomeSocialMode':
          return 'welcomeSocialMode';
        case 'socialMode': 
          return 'socialMode';
        case 'closeUpMode':
          return 'closeUpMode';
        case 'welcomeSingleMode':
          return 'welcomeSingleMode'
        case 'farMode':
          return 'farMode';
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
        },
        getQPS: function() {
          return Meteor.http.get('http://www.turn.com/sites/all/modules/turn_home_js/qps.php');
        }
    });



    // code to run on server at startup
  });
}
