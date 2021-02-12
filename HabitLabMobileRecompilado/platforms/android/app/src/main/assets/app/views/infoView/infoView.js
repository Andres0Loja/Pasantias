var drawer;
var StorageUtil = require('~/util/StorageUtil');
var observable = require("data/observable");
var events;
var page;

exports.toggleDrawer = function() {
  events.push({category: "navigation", index: "menu"});
  drawer.toggleDrawerState();
};

exports.pageLoaded = function(args) {
  page = args.object;
  page.bindingContext = new observable.Observable();
  events = [{category: "page_visits", index: "settings_info"}];
  drawer = args.object.getViewById("sideDrawer"); 
};

exports.pageUnloaded = function(args) {
  StorageUtil.addLogEvents(events);
};
