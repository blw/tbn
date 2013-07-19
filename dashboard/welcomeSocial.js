if (Meteor.isClient && document.location.pathname === "/welcomeSocialMode") {
    Meteor.setTimeout(function() {
      if (document.location.pathname !== "/socialMode") {
          document.location = "/socialMode";  
      } 
    }, 2000);
}

