/** @format */

import {AppRegistry, Platform, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Push from './helpers/Push';

import {Sentry, SentryLog} from 'react-native-sentry';
import Config from './Config';
import GlobalState from "./models/GlobalState";
import {Notify} from "./helpers/Notify";

if (__DEV__ !== true) {
    Sentry.config(Config.sentryDSN, {
        deactivateStacktraceMerging: true,
        logLevel: SentryLog.Verbose,
        // currently sentry is not reporting errors on android using the native module
        disableNativeIntegration: Platform.OS === 'android',
    }).install();
    const app = require('./package');
    Sentry.setExtraContext({
        version: app.version
    });

    var console = {};
    console.log = function () {
    };

    console.warn = function () {
    };
    console.error = function () {
    };
    console.info = function () {
    };
}

new GlobalState();
new Push();
// Push.saveToken();
new Notify();

YellowBox.ignoreWarnings([
    'Remote debugger', //In background
    '{}', //Geolocation
]);

AppRegistry.registerComponent(appName, () => App);
