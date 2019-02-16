/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Push from './helpers/Push';
import {Platform} from 'react-native'


import {Sentry, SentryLog} from 'react-native-sentry';
import Config from './Config';
Sentry.config(Config.sentryDSN, {
    deactivateStacktraceMerging: true,
    logLevel: SentryLog.Verbose,
    // currently sentry is not reporting errors on android using the native module
    disableNativeIntegration: Platform.OS === 'android',
}).install();

new Push();


AppRegistry.registerComponent(appName, () => App);
