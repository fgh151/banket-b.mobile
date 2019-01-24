import config from '../Config';
import {AppState, AsyncStorage, Platform, Permissions} from "react-native";
import Client from '../http/Client';

import FCM, {
    FCMEvent,
    NotificationActionOption,
    NotificationActionType,
    NotificationCategoryOption,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from "react-native-fcm";
import React from "react";

export default class Push {

    url = '/api/v2/push';
    granted = false;

    async saveToken() {
        const token = await FCM.getFCMToken();
        const apns = await FCM.getAPNSToken();

        console.log("Save token", token);
        console.log("Save apns", apns);

        AsyncStorage.getItem('battle@id')
            .then((userId) => {
                const api = new Client();
                api.POST(this.url, {
                    user: userId,
                    token: token,
                    device: Platform.OS,
                    apns: apns,
                })
            })
    }

    constructor(props) {

        FCM.requestPermissions().then(() => {
            this.granted = true;
            console.log('Push permission granted');
            this.saveToken();
        });

        this.setup();

        // this.showNotification();
    }




    setup() {


        FCM.createNotificationChannel({
            id: 'default',
            name: 'Default',
            description: 'used for example',
            priority: 'high'
        });

        // FCM.getInitialNotification().then(notif => {
        //     console.log('getInitialNotification', notif);
        // });


        //  FCM.on(FCMEvent.Remote, (notif) => {
        //     console.log('IOS!', notif)
        // });


        FCM.on(FCMEvent.Notification, async (notif) => {
            console.log('event notification', notif);

            if (notif.opened_from_tray) {
                alert('clicked on notification');
                console.log('got a opened_from notification');
            }
            if (notif.local_notification) {
                console.log('got a local notification');
            }

            // if (Platform.OS === 'ios') {
            //     switch (notif._notificationType) {
            //         case NotificationType.Remote:
            //             // notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            //             break;
            //         case NotificationType.NotificationResponse:
            //             // notif.finish();
            //             break;
            //         case NotificationType.WillPresent:
            //             console.log('in the method');
            //             // notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
            //             break;
            //     }
            // }
            this.showNotification(notif);

        });
    }

    // sync setup() {
    //     //FCM.createNotificationChannel is mandatory for Android targeting >=8. Otherwise you won't see any notification
    //     FCM.createNotificationChannel({
    //         id: 'default',
    //         name: 'Default',
    //         description: 'used for example',
    //         priority: 'high'
    //     })
    //     registerAppListener(this.props.navigation);
    //     FCM.getInitialNotification().then(notif => {
    //         this.setState({
    //             initNotif: notif
    //         });
    //         if (notif && notif.targetScreen === "detail") {
    //             setTimeout(() => {
    //                 this.props.navigation.navigate("Detail");
    //             }, 500);
    //         }
    //     });
    //
    //     try {
    //         let result = await FCM.requestPermissions({
    //             badge: false,
    //             sound: true,
    //             alert: true
    //         });
    //     } catch (e) {
    //         console.error(e);
    //     }
    //
    //     FCM.getFCMToken().then(token => {
    //         console.log("TOKEN (getFCMToken)", token);
    //         this.setState({ token: token || "" });
    //     });
    //
    //     if (Platform.OS === "ios") {
    //         FCM.getAPNSToken().then(token => {
    //             console.log("APNS TOKEN (getFCMToken)", token);
    //         });
    //     }
    //
    //     // topic example
    //     // FCM.subscribeToTopic('sometopic')
    //     // FCM.unsubscribeFromTopic('sometopic')
    // }

    showNotification(notif) {
        console.log(typeof notif);

        if (typeof notif === 'object') {

            console.log('notif type', notif.constructor.name);
            console.log('notif', notif);

            let n = {};

            if (Platform.OS === 'ios') {
                n = {
                    title: notif.title,
                    color: notif.color,
                    big_text: notif.big_text,
                    body: notif.big_text,
                    icon: notif.icon, //"ic_launcher"
                    sub_text: notif.sub_text,
                };
            } else {
                n = {
                    title: notif.fcm.title,
                    color: notif.fcm.color,
                    body: notif.fcm.body,
                    icon: notif.fcm.icon, //"ic_launcher"
                    sub_text: '',
                    big_text: ''
                };
            }


            this.showLocalNotification(n, notif);
        }
    }


    showLocalNotification(notification, source) {

        console.log('SHOW local ', notification, source);

        FCM.presentLocalNotification({
            channel: 'default',
            id: new Date().valueOf().toString(), // (optional for instant notification)
            title: notification.title, // as FCM payload
            body: notification.body, // as FCM payload (required)
            sound: "bell.mp3", // "default" or filename
            priority: "high", // as FCM payload
            click_action: "com.myapp.MyCategory", // as FCM payload - this is used as category identifier on iOS.
            badge: 10, // as FCM payload IOS only, set 0 to clear badges
            number: 10, // Android only
            ticker: "My Notification Ticker", // Android only
            auto_cancel: true, // Android only (default true)
            large_icon:
                "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg", // Android only
            icon: notification.icon, // as FCM payload, you can relace this with custom icon you put in mipmap
            big_text: notification.big_text, // Android only
            sub_text: notification.sub_text, // Android only
            color: notification.color, // Android only
            vibrate: 300, // Android only default: 300, no vibration if you pass 0
            wake_screen: true, // Android only, wake up screen when notification arrives
            group: "group", // Android only
            picture:
                "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png", // Android only bigPicture style
            ongoing: true, // Android only
            my_custom_data: "my_custom_field_value", // extra data you want to throw
            lights: true, // Android only, LED blinking (default false)
            show_in_foreground: true // notification when app is in foreground (local & remote)
        });

        source.finish();

    }

}


// AsyncStorage.getItem('lastNotification').then(data => {
//     if (data) {
//         // if notification arrives when app is killed, it should still be logged here
//         console.log('last notification', JSON.parse(data));
//         AsyncStorage.removeItem('lastNotification');
//     }
// })
//
// AsyncStorage.getItem('lastMessage').then(data => {
//     if (data) {
//         // if notification arrives when app is killed, it should still be logged here
//         console.log('last message', JSON.parse(data));
//         AsyncStorage.removeItem('lastMessage');
//     }
// })

export function registerKilledListener() {
    // these callback will be triggered even when app is killed
    FCM.on(FCMEvent.Notification, notif => {
        AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
        if (notif.opened_from_tray) {
            setTimeout(() => {
                if (notif._actionIdentifier === 'reply') {
                    if (AppState.currentState !== 'background') {
                        console.log('User replied ' + JSON.stringify(notif._userText))
                        alert('User replied ' + JSON.stringify(notif._userText));
                    } else {
                        AsyncStorage.setItem('lastMessage', JSON.stringify(notif._userText));
                    }
                }
                if (notif._actionIdentifier === 'view') {
                    alert("User clicked View in App");
                }
                if (notif._actionIdentifier === 'dismiss') {
                    alert("User clicked Dismiss");
                }
            }, 1000)
        }
    });
}

// these callback will be triggered only when app is foreground or background
export function registerAppListener(navigation) {

    console.log('reg listenere');

    FCM.on(FCMEvent.Notification, notif => {
        console.log("Notification", notif);

        if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
            // this notification is only to decide if you want to show the notification when user if in foreground.
            // usually you can ignore it. just decide to show or not.
            notif.finish(WillPresentNotificationResult.All)
            return;
        }

        if (notif.opened_from_tray) {
            if (notif.targetScreen === 'detail') {

                console.log('navigate to detail');

                // setTimeout(() => {
                //     navigation.navigate('Detail')
                // }, 500)
            }
            setTimeout(() => {
                alert(`User tapped notification\n${JSON.stringify(notif)}`)
            }, 500)
        }

        if (Platform.OS === 'ios') {
            //optional
            //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
            //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
            //notif._notificationType is available for iOS platfrom
            switch (notif._notificationType) {
                case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;
                case NotificationType.NotificationResponse:
                    notif.finish();
                    break;
                case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                    // this type of notificaiton will be called only when you are in foreground.
                    // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
                    break;
            }
        }
    });

    FCM.on(FCMEvent.RefreshToken, token => {
        console.log("TOKEN (refreshUnsubscribe)", token);
    });

    FCM.enableDirectChannel();
    FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
        console.log('direct channel connected' + data);
    });
    setTimeout(function () {
        FCM.isDirectChannelEstablished().then(d => console.log(d));
    }, 1000);
}

FCM.setNotificationCategories([
    {
        id: 'com.myidentifi.fcm.text',
        actions: [
            {
                type: NotificationActionType.TextInput,
                id: 'reply',
                title: 'Quick Reply',
                textInputButtonTitle: 'Send',
                textInputPlaceholder: 'Say something',
                intentIdentifiers: [],
                options: NotificationActionOption.AuthenticationRequired
            },
            {
                type: NotificationActionType.Default,
                id: 'view',
                title: 'View in App',
                intentIdentifiers: [],
                options: NotificationActionOption.Foreground
            },
            {
                type: NotificationActionType.Default,
                id: 'dismiss',
                title: 'Dismiss',
                intentIdentifiers: [],
                options: NotificationActionOption.Destructive
            }
        ],
        options: [NotificationCategoryOption.CustomDismissAction, NotificationCategoryOption.PreviewsShowTitle]
    }
])