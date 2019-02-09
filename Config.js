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
appsFlyer.initSdk(appsFlyerConfig, () => {
}, () => {
});

const config = {
    apiUrl: 'https://api.banket-b.ru',
    // apiUrl: 'http://f-api.banket.restorate.ru',
    cabinetUrl: 'https://banket-b.ru',
    // cabinetUrl: 'http://f-cabinet.banket.restorate.ru',

    //Время кеширования на небольшой промежуток времени в минутах
    lowCache: 10,
    //Время кеширования на небольшой длительны времени в минутах
    highCache: 100,

    firebase: {
        appId: "1:552523161732:android:90582f78acdd4ec1",
        apiKey: "AIzaSyDdt9Dc6lcyrLHphwL8WTflG3AKsu-HgkE",
        // authDomain: "<YOUR-AUTH-DOMAIN>",
        databaseURL: "https://banket-b.firebaseio.com/",
        // messagingSenderId: '123',
        projectId: 'banket-b',
        storageBucket: 'restorate-battle.appspot.com'
    },

    // firebase: {
    //     appId: "1:911932262915:android:1fb0623114da33be",
    //     apiKey: "AIzaSyDDGo2kRmSJ_oORXgf-I-cNgBM2JMyX93Q",
    //     // authDomain: "<YOUR-AUTH-DOMAIN>",
    //     databaseURL: "https://restorate-battle.firebaseio.com",
    //     // messagingSenderId: '123',
    //     projectId: 'restorate-battle',
    //     storageBucket: 'restorate-battle.appspot.com'
    // },


    sentryDSN: 'https://853a3e3476854893b66e1c1652f3ad90@sentry.io/1328643'
};
export const firebase = Firebase.initializeApp(config.firebase);
export const db = firebase.database();

export default config;

