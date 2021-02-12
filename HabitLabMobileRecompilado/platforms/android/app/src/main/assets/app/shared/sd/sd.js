var frameModule = require("ui/frame");
var menu;
var observable = require("data/observable");
var onClicksSet;
var StorageUtil = require('~/util/StorageUtil');
var menuEvents;
var options = ['progress', 'goals', 'settings', 'nudges', 'watchlist', 'lockdown', 'snooze'];
var Toast = require("nativescript-toast");
const CheckboxOverlay = require("~/overlays/CheckboxOverlay");
const CancelOverlay = require("~/overlays/CancelOverlay");
const UsageInformationUtil = require("~/util/UsageInformationUtil");
const localize = require("nativescript-localize");

var setOnTouches = function() {

  options.forEach(function (item) {
    var opt = menu.getViewById(item + '-option');
    opt.backgroundColor = menu.page.id === item ? '#F5F5F5' : '#FFFFFF';

    opt.off("touch");
    opt.on("touch", function (args) {
      if (args.action === 'down') {
        opt.backgroundColor = '#DCDCDC';
      } else if (args.action === 'cancel') {
        opt.backgroundColor = menu.page.id === item ? '#F5F5F5' : '#FFFFFF';
      } else if (args.action === 'up') {
        if (item === 'snooze' || item === 'lockdown') {
          opt.backgroundColor = '#FFFFFF';
          return;
        } else if (item === 'nudges') {
          item = 'interventions';
        }
        frameModule.topmost().navigate("views/" + item + 'View/' + item + 'View');
      }
    });
  });
};


var createLockdownDialog = function() {
  CheckboxOverlay.showOverlay(
  	localize("shared.sd.overlays.lockdown.title"), 
  	localize("shared.sd.overlays.lockdown.time1"), 
  	localize("shared.sd.overlays.lockdown.time2"), 
  	localize("shared.sd.overlays.lockdown.time3"), 
  	localize("shared.sd.overlays.lockdown.time4"), 
  	false, 
  	true
  	);
};


exports.setLockdown = function() {
  menuEvents.push({category: "features", index: "lockdown_opened"});
  if (StorageUtil.inLockdownMode()) {
    menuEvents.push({category: "features", index: "remove_lockdown"});
    CancelOverlay.showCancelLockDialog(
    		localize("shared.sd.overlays.cancelLock.title"), 
    		localize("shared.sd.overlays.cancelLock.message"), 
    		localize("shared.sd.overlays.cancelLock.okButton"), 
    		localize("shared.sd.overlays.cancelLock.cancelButton"), 
    		unlock, 
    		null);
  } else {
    createLockdownDialog();
  }
};

var unlock = function() {
  menuEvents.push({category: "features", index: "remove_lockdown"});
  Toast.makeText(localize("shared.sd.toasts.1")).show();
  StorageUtil.removeLockdown();
}


var createSnoozeDialog = function() {
  CheckboxOverlay.showOverlay(
  	localize("shared.sd.overlays.snooze.title"), 
  	localize("shared.sd.overlays.snooze.time1"), 
  	localize("shared.sd.overlays.snooze.time2"), 
  	localize("shared.sd.overlays.snooze.time3"), 
  	localize("shared.sd.overlays.snooze.time4"),  
  	true, 
  	false);
};

exports.setSnooze = function() {
  menuEvents.push({category: "features", index: "snooze_opened"});
  if (StorageUtil.inSnoozeMode()) {
    menuEvents.push({category: "features", index: "remove_snooze"});
    CancelOverlay.showCancelSnoozeDialog(
    		localize("shared.sd.overlays.cancelSnooze.title"), 
    		localize("shared.sd.overlays.cancelSnooze.message"), 
    		localize("shared.sd.overlays.cancelSnooze.okButton"), 
    		localize("shared.sd.overlays.cancelSnooze.cancelButton"), 
    		removeSnooze, 
    		null
    );
  } else {
    createSnoozeDialog();
  }
};



var removeSnooze = function() {
  menuEvents.push({category: "features", index: "remove_snooze"});
  Toast.makeText(localize("shared.sd.toasts.2")).show();
  StorageUtil.removeSnooze();
}

exports.onLoaded = function(args) {
  menu = args.object;
  menu.contextBindings = new observable.Observable();
  menuEvents = [];
  setOnTouches();
};

exports.menuUnloaded = function(args) {
  StorageUtil.addLogEvents(menuEvents);
};
