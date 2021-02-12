var frame = require('ui/frame')
var fancyAlert = require("nativescript-fancyalert");
var PermissionUtil = require("~/util/PermissionUtil");
var StorageUtil = require("~/util/StorageUtil")
var page;
const application = require("application");
const fromObject = require("data/observable").fromObject;

const localize = require("nativescript-localize");

exports.pageLoaded = function(args) {
  page = args.object
  source = fromObject({
    button_text: localize("views.onboarding.overlayPermissionView.button1"),
    text_field : localize("views.onboarding.overlayPermissionView.text"),
    done: "visible"
  })
  page.bindingContext = source
  StorageUtil.addLogEvents([{category: "navigation", index: "overlayPermissionView"}])
  if (!PermissionUtil.checkSystemOverlayPermission()) {
    fancyAlert.TNSFancyAlert.showInfo(
    	localize("views.onboarding.overlayPermissionView.alert.title"), 
    	localize("views.onboarding.overlayPermissionView.alert.message"), 
    	localize("views.onboarding.overlayPermissionView.alert.extra")
    );
  } else if (frame.topmost() == page) {
    frame.topmost().navigate({
      moduleName: 'views/onboarding/accessibilityPermissionView/accessibilityPermissionView',
    });
  } else {
    //Set button text to move on:
    source.set("button_text", localize("views.onboarding.overlayPermissionView.moveOn.button"))
    source.set("text_field",  localize("views.onboarding.overlayPermissionView.moveOn.text"))
    source.set("done", "hidden")
  }
  
};


//When the user taps the 'give permission' button - If the user hasn't already given permission, open settings
exports.giveDrawPermission = function(args) {
  if(!PermissionUtil.checkSystemOverlayPermission()) {
    PermissionUtil.launchSystemOverlayIntent();
  } else {
    exports.moveOn()
  }
};

exports.backEvent = function(args) {
   args.cancel = true; 
}

exports.moveOn = function(args) {
  frame.topmost().navigate({
    moduleName: 'views/onboarding/accessibilityPermissionView/accessibilityPermissionView',
  });
}
