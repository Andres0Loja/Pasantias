var application = require("application");
var frameModule = require('ui/frame');
var fancyAlert = require("nativescript-fancyalert");
var PermissionUtil = require("~/util/PermissionUtil");
var StorageUtil = require("~/util/StorageUtil");
var observable = require("data/observable");
var page;

const localize = require("nativescript-localize");

exports.pageLoaded = function(args) {
  page = args.object;
  page.bindingContext = new observable.Observable()
  fancyAlert.TNSFancyAlert.showSuccess(
  	localize("views.onboarding.accessibilityPermissionView.alert.title"), 
  	localize("views.onboarding.accessibilityPermissionView.alert.message"), 
  	localize("views.onboarding.accessibilityPermissionView.alert.extra")
  );
};

//When the user taps the 'give permission' button - If the user hasn't already given permission, open settings
exports.giveAccessibilityPermission = function(args) {
  if (!PermissionUtil.checkAccessibilityPermission()) {
   	PermissionUtil.launchAccessibilityServiceIntent();
 	} else {
    frameModule.topmost().navigate({
      moduleName: 'views/goalsView/goalsView',
      clearHistory: true
    });
	}
}

exports.backEvent = function(args) {
   args.cancel = true; 
}
