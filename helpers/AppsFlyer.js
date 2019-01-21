import appsFlyer from 'react-native-appsflyer';

export default function trackEvent(eventName, params, success, error) {

    if (typeof success !== 'function') {
        success = () => {
        };
    }
    if (typeof error !== 'function') {
        error = () => {
        };
    }

    appsFlyer.trackEvent(eventName, params, success, error);
}