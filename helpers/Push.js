import {AppState, Permissions, Platform, Vibration} from "react-native";
import Client from '../http/Client';
import React from "react";
import firebase from "react-native-firebase";
import EventBus from 'eventing-bus';
import AS from '@react-native-community/async-storage'
import {BUS_CLEAR_NOTIFICATIONS, STORAGE_AUTH_ID} from "./Constants";
import {Actions} from "react-native-router-flux";

const FCM = firebase.messaging();
const FN = firebase.notifications();

export default class Push {

    url = '/api/v2/push';
    granted = false;

    static instance;

    constructor() {
        if (Push.instance) {
            return Push.instance;
        }

        Push.instance = this;

        this.checkPermissions();
        this.setRecieveHandler();

        EventBus.on(BUS_CLEAR_NOTIFICATIONS, () => {
            Push.clearNotifications();
        })
    }

    static async saveToken() {
        const token = await FCM.getToken();
        AS.getItem(STORAGE_AUTH_ID)
            .then((userId) => {
                if (userId) {
                    // console.log("Save token", userId, token);
                    const api = new Client();
                    api.POST('/v2/push', {
                        user: userId,
                        token: token,
                        device: Platform.OS,
                    }).then((s) => {
                    })
                }
                // .catch((e) => console.log(e));
            })
    }

    checkPermissions() {
        FCM.hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.granted = true;
                    // console.log('Push permission granted');
                    Push.saveToken();
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            Push.saveToken();
                        });
                }
            });
    }

    static clearNotifications() {
        FN.cancelAllNotifications();
        FN.removeAllDeliveredNotifications();
        if (Platform.OS === 'ios') {
            FN.setBadge(0);
        }
    }

    setRecieveHandler() {
        FN.onNotificationOpened((notificationOpen) => {
            FN.removeDeliveredNotification(notificationOpen.notification.notificationId)
            const api = new Client();
            api.GET('/v2/push/info', {
                organizationId: notificationOpen.notification.data.organizationId,
                proposalId: notificationOpen.notification.data.proposalId,
            }).then((info) => {

                console.log('get push info', info)

                Actions.Messenger({
                    organization: info.organization,
                    proposal: info.proposal,
                });
            })
            // .catch((e) => console.log(e));
        });

        FN.onNotification((notification: Notification) => {
            if (AppState.currentState !== 'active') {
                notification
                    .android.setChannelId('test-channel')
                    .android.setSmallIcon('ic_launcher');
                firebase.notifications()
                    .displayNotification(notification)
                    .then(() => {
                        Vibration.vibrate(100, [1000, 2000, 3000]);
                    });
            } else {
                if (notification.data) {
                    console.log('notify', notification.data);
                    if (notification.data.hasOwnProperty('proposalId')) {
                        EventBus.publish('p_' + notification.data.proposalId); //ProposalListItem
                        EventBus.publish('p_' + notification.data.proposalId + 'o_' + notification.data.organizationId); //Messenger, DialogListItem
                    }
                }
            }
        });
    }
}

