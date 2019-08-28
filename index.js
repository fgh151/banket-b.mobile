/** @format */

import {AppRegistry, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Push from './helpers/Push';

import {firebase} from './Config';
import GlobalState from "./models/GlobalState";

if (__DEV__ !== true) {

    const app = require('./package');
    firebase.crashlytics().setStringValue('version', app.version);

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

YellowBox.ignoreWarnings([
    'Remote debugger', //In background
    '{}', //Geolocation
]);

AppRegistry.registerComponent(appName, () => App);
