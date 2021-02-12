"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sprintf_js_1 = require("sprintf-js");
var application_1 = require("tns-core-modules/application");
var application_settings_1 = require("tns-core-modules/application-settings");
var platform_1 = require("tns-core-modules/platform");
var utils = require("tns-core-modules/utils/utils");
var resource_1 = require("./resource");
var getResources = (function () {
    var resources = null;
    return function () {
        if (resources === null) {
            resources = utils.ad.getApplicationContext().getResources();
        }
        return resources;
    };
})();
function localize(key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var localizedString;
    try {
        var identifier = utils.ad.resources.getStringId(resource_1.encodeKey(key));
        localizedString = identifier === 0 ? key : getResources().getString(identifier);
    }
    catch (error) {
        localizedString = key;
    }
    return sprintf_js_1.vsprintf(localizedString, args);
}
exports.localize = localize;
function androidLaunchEventLocalizationHandler() {
    var lang = application_settings_1.getString("__app__language__", 'none');
    if (lang !== 'none' && platform_1.isAndroid) {
        var locale = new java.util.Locale(lang);
        java.util.Locale.setDefault(locale);
        var resources = application_1.android.context.getResources();
        var configuration = resources.getConfiguration();
        configuration.locale = locale;
        resources.updateConfiguration(configuration, resources.getDisplayMetrics());
    }
}
exports.androidLaunchEventLocalizationHandler = androidLaunchEventLocalizationHandler;
function overrideLocale(locale) {
    application_settings_1.setString("__app__language__", locale.substring(0, 2));
    return true;
}
exports.overrideLocale = overrideLocale;
