var StorageUtil = require('~/util/StorageUtil');
var gestures = require("ui/gestures").GestureTypes;
var builder = require('ui/builder');

var drawer;
var page;
var list;
var events;

const localize = require("nativescript-localize");

var QandA = [{
  question: localize('views.faqView.1.question'),
  answer: localize('views.faqView.1.answer')
}, {
  question: localize('views.faqView.2.question'),
  answer: localize('views.faqView.2.answer') 
}, {
  question: localize('views.faqView.3.question'),
  answer: localize('views.faqView.3.answer')
}, {
  question: localize('views.faqView.4.question'),
  answer: localize('views.faqView.4.answer')
}, {
  question: localize('views.faqView.5.question'),
  answer: localize('views.faqView.5.answer')
}, {
  question: localize('views.faqView.6.question'),
  answer: localize('views.faqView.6.answer') 
}, {
  question: localize('views.faqView.7.question'),
  answer: localize('views.faqView.7.answer')
}, {
  question: localize('views.faqView.8.question'),
  answer: localize('views.faqView.8.answer')
}, {
  question: localize('views.faqView.9.question'),
  answer: localize('views.faqView.9.answer')
}, {
  question: localize('views.faqView.10.question'),
  answer: localize('views.faqView.10.answer')
}, {
  question: localize('views.faqView.11.question'),
  answer: localize('views.faqView.11.answer')
}, {
  question: localize('views.faqView.12.question'),
  answer: localize('views.faqView.12.answer')
}, {
  question: localize('views.faqView.13.question'),
  answer: localize('views.faqView.13.answer')
}, {
  question: localize('views.faqView.14.question'),
  answer: localize('views.faqView.14.answer')
}, {
  question: localize('views.faqView.15.question'),
  answer: localize('views.faqView.15.answer')
}, {
  question: localize('views.faqView.16.question'),
  answer: localize('views.faqView.16.answer')
}];

var createFAQitem = function(info, id) {
  var item = builder.load({
    path: 'shared/faqelem',
    name: 'faqelem',
    page: page
  });
  item.id = 'faq' + id;
  item.className = 'faq-item';

  var q = item.getViewById('question');
  q.text = info.question;
  q.textWrap = true;
  q.className = 'faq-question gray';

  var a = item.getViewById('answer');
  a.text = info.answer;
  a.textWrap = true;
  a.className = 'faq-answer';

  var toggle = item.getViewById('toggle');
  toggle.src = "res://ic_show_more";
  toggle.className = 'faq-toggle gray';

  q.on(gestures.tap, function() {
    events.push({category: "features", index: "faq_item"});
    toggle.src = toggle.src === "res://ic_show_more" ? "res://ic_show_less" : "res://ic_show_more";
    a.visibility = a.visibility === 'visible' ? 'collapse' : 'visible';
  });

  return item;
};

exports.pageLoaded = function(args) {
  events = [{category: "page_visits", index: "settings_faq"}];
  page = args.object;
  page.bindingContext = {};
  drawer = page.getViewById('sideDrawer');
  list = page.getViewById('faq-list');
  QandA.forEach(function (elem, index) {
    if (!list.getViewById('faq' + index)) {
      list.addChild(createFAQitem(elem, index));
    }
  });
};

exports.pageUnloaded = function(args) {
  StorageUtil.addLogEvents(events);
};

exports.toggleDrawer = function() {
  events.push({category: "navigation", index: "menu"});
  drawer.toggleDrawerState();
};
