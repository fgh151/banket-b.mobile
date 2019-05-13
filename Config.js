import Firebase from 'react-native-firebase';
import {Platform} from 'react-native';
import appsFlyer from 'react-native-appsflyer';

let appsFlyerConfig;
const devKey = "DwbnsDqNK2Qhg5E2Xgyn29";
if (Platform.OS === 'ios') {
    appsFlyerConfig = {
        appId: "1351089239",
        devKey: devKey
    };
} else {
    appsFlyerConfig = {
        devKey: devKey
    }
}
appsFlyer.initSdk(appsFlyerConfig,(result) => {
        // console.log(result);
    },
    (error) => {
        // console.error(error);
    });

const config = {
    apiUrl: 'https://api.banket-b.ru',
    // apiUrl: 'https://api.banket-b.ru',
    // apiUrl: 'http://f-api.banket.restorate.ru',
    cabinetUrl: 'https://banket-b.ru',
    // cabinetUrl: 'http://f-cabinet.banket.restorate.ru',

    //Время кеширования на небольшой промежуток времени в минутах
    lowCache: 10,
    //Время кеширования на небольшой длительны времени в минутах
    highCache: 100,

    sentryDSN: 'https://853a3e3476854893b66e1c1652f3ad90@sentry.io/1328643',

    smsCodeLength: 4
};
export const firebase = Firebase.app();
export const db = firebase.database();

export default config;

