var StorageUtil = require("~/util/StorageUtil");
var IM = require('~/interventions/InterventionManager');
var ID = require('~/interventions/InterventionData');
var fancyAlert = require("nativescript-fancyalert");
var observable = require("data/observable");
var Toast = require("nativescript-toast");
var DialogOverlay = require('~/overlays/DialogOverlay');
var NotificationUtil = require('~/util/NotificationUtil');
var application = require("application");
var context = application.android.context;

var frameModule = require('ui/frame');
var FancyAlert = require("~/util/FancyAlert");

var drawer;
var page;
var interventionList;
var events;
var search;
var noResults;
var pageData;

const localize = require("nativescript-localize");

exports.closeKeyboard = function() {
  search.dismissSoftInput();
};

exports.onShowSearch = function(args) {
  search.visibility = search.visibility === 'visible' ? 'collapse' : 'visible';
};

var types = {toast: 0, notification: 1, dialog: 2, overlay: 3};
var order = {priority: 0, easy: 1, medium: 2, hard: 3};
var initializeList = function() {
  interventionList = ID.interventionDetails.filter(function (nudge) {
    // check if the nudge is implemented
    if (!IM.interventions[nudge.id]) return false;

    // check that if apps is specified then they have watchlisted a specified app for that nudge
    var canIntervene = !ID.interventionDetails[nudge.id].apps;
    if (!canIntervene) {
      var appList = StorageUtil.getSelectedPackages();
      var result = appList.filter(function (item) { 
        return ID.interventionDetails[nudge.id].apps.indexOf(item) > -1;
      });
      if (!result.length) return false;
    }

    return true;
  });
  
  interventionList.push({
    title: localize("views.interventionsView.interventionsList.hintBubbles.title"),
    isHeader: true,
    style: 'toast',
    level: 'priority'
  }, {
    title: localize("views.interventionsView.interventionsList.notifications.title"),
    isHeader: true,
    style: 'notification',
    level: 'priority'
  }, {
    title: localize("views.interventionsView.interventionsList.alerts.title"),
    isHeader: true,
    style: 'dialog',
    level: 'priority'
  }, {
    title: localize("views.interventionsView.interventionsList.other"),
    isHeader: true,
    style: 'overlay',
    level: 'priority'
  });

  interventionList.sort(function (a, b) {
    return (types[a.style] - types[b.style]) || (order[a.level] - order[b.level]) || (a.name < b.name ? -1 : 1);
  });

  pageData.set('nudges', interventionList);
};

exports.onItemTap = function(args) {
  var tappedItem = pageData.get('nudges')[args.index];
  if (!tappedItem.isHeader) { // if what's been clicked is not a header
    search.dismissSoftInput();
    frameModule.topmost().navigate({
      moduleName: "views/detailView/detailView",
      context: {
        info: tappedItem
      },
      animated: true,
      transition: {
        name: "slide",
        duration: 380,
        curve: "easeIn"
      }
    });
  } else {
    switch(tappedItem.title) {
      case(localize("views.interventionsView.interventionsList.hintBubbles.title")):
          Toast.makeText(localize("views.interventionsView.interventionsList.hintBubble.description")).show();
          break;
      case(localize("views.interventionsView.interventionsList.notifications.title")):
          NotificationUtil.sendNotification(
          	context, 
          	"Demo", 
          	localize("views.interventionsView.interventionsList.notifications.description"), 
          	0, 0
          );
          break;
      case(localize("views.interventionsView.interventionsList.alerts.title")):
          var name = StorageUtil.getName();
          DialogOverlay.showOneOptionDialogOverlay(
          	"Hey " + name + ", " + localize("views.interventionsView.alerts.description"), 
          	"Ok", 
          	context
          );
          break;
      default:
          break;
    }
    

  }
};

// function for creating your own nudge
exports.ownNudge = function() {
  frameModule.topmost().navigate({
    moduleName: "views/ownNudgeView/ownNudgeView",
    animated: true,
    transition: {
      name: "slide",
      duration: 380,
      curve: "easeIn"
    }
  });
}

// for tracking if there are actually interventions for the headers
var setList = function() {
  var styleCounts = {toast: -1, notification: -1, dialog: -1, overlay: -1};
  var filter = pageData.get('filter');
  tempList = interventionList.filter(function (nudge) {
    // check if the filter is included in the nudge (or if it is a header)
    var include = nudge.isHeader || !filter || nudge.name.toLowerCase().includes(filter) || nudge.style.includes(filter) || nudge.description.toLowerCase().includes(filter) || nudge.summary.toLowerCase().includes(filter);
    if (include) {
      styleCounts[nudge.style]++;
    }
    return include;
  });

  tempList = tempList.filter(function (nudge) {
    return styleCounts[nudge.style];
  });

  if (!tempList.length) {
    noResults.visibility = 'visible';
  } else {
    noResults.visibility = 'collapse';
  }

  pageData.set('nudges', tempList);  
};

var visited = false;
exports.pageLoaded = function(args) {
  events = [{category: "page_visits", index: "nudges_main"}];

  page = args.object;
  pageData = new observable.Observable();
  search = page.getViewById('search-bar');
  drawer = page.getViewById('sideDrawer');
  noResults = page.getViewById('no-results');

  page.bindingContext = pageData;
  pageData.set('filter', '');
  if (!StorageUtil.isTutorialComplete()) {
    if (!visited) {
      FancyAlert.show(
      	FancyAlert.type.INFO, 
      	localize("views.interventionsView.alerts.info.title"), 
      	localize("views.interventionsView.alerts.info.message"), 
      	"Ok"
      );
      visited = true;
    }
    page.getViewById('finish').visibility = 'visible';
    page.getViewById('search-icon').visibility = 'collapse';
    page.getViewById('nudges-list').height = '90%';
  }

  initializeList();
  pageData.addEventListener(observable.Observable.propertyChangeEvent, function (pcd) {
    if (pcd.propertyName.toString() === 'filter') {
      setList();
    }
  });

};

exports.goToProgress = function() {
  StorageUtil.addLogEvents([{setValue: new Date().toLocaleString(), category: 'navigation', index: 'finished_tutorial'}]);
  StorageUtil.setTutorialComplete();
  FancyAlert.show(
  	FancyAlert.type.SUCCESS, 
  	localize("views.interventionsView.alerts.success.title"), 
     localize("views.interventionsView.alerts.success.message"), 
     localize("views.interventionsView.alerts.success.extra"), 
     null
  );
  // fancyAlert.TNSFancyAlert.showSuccess("All set!", "HabitLab can now start helping you create better mobile habits! Just keep using your phone like normal.", "Awesome!");
  frameModule.topmost().navigate({
    moduleName: "views/progressView/progressView",
    context: { 
      fromTutorial: true
    }
  });
};

exports.pageUnloaded = function(args) {
  StorageUtil.addLogEvents(events);
};

exports.toggleDrawer = function() {
  if (!StorageUtil.isTutorialComplete()) {
    fancyAlert.TNSFancyAlert.showError(
   		localize("views.interventionsView.alerts.error.title"), 
   		localize("views.interventionsView.alerts.error.message"), 
   		localize("views.interventionsView.alerts.error.extra"),
    );
  } else {
    search.dismissSoftInput();
    events.push({category: "navigation", index: "menu"});
    drawer.toggleDrawerState();
  }
};
