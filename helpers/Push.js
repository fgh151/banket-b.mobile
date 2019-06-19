import {AppState, AsyncStorage, Permissions, Platform, Vibration} from "react-native";
import Client from '../http/Client';
import React from "react";
import firebase from "react-native-firebase";
import EventBus from 'eventing-bus';

const FCM = firebase.messaging();
const FN = firebase.notifications();
export const NEW_MESSAGE_EVENT = 'new_message_event';

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
    }

    checkPermissions() {
        FCM.hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.granted = true;
                    console.log('Push permission granted');
                    Push.saveToken();
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            Push.saveToken();
                        });
                }
            });
    }

    static async saveToken() {
        const token = await FCM.getToken();

        console.log("Save token", token);

        AsyncStorage.getItem('battle@id')
            .then((userId) => {
                console.log("Save token", userId, token);
                const api = new Client();
                api.POST('/v2/push', {
                    user: userId,
                    token: token,
                    device: Platform.OS,
                }).then((s) => console.log(s))
                    .catch((e) => console.log(e));
            })
    }

    static clearNotifications() {
        FN.cancelAllNotifications();
        FN.removeAllDeliveredNotifications();
    }

    setRecieveHandler() {
        FN.onNotification((notification: Notification) => {

            console.log('recive notify', notification);

            if (AppState.currentState !== 'active') {
                notification
                    .android.setChannelId('test-channel')
                    .android.setSmallIcon('ic_launcher');
                firebase.notifications()
                    .displayNotification(notification)
                    .then(() => {
                        Vibration.vibrate(100, [1000, 2000, 3000]);
                    });
            }

            if (notification.data) {
                if (notification.data.hasOwnProperty('proposalId')) {
                    console.log('eb send');

                    EventBus.publish(NEW_MESSAGE_EVENT, {
                        'proposalId': notification.data.proposalId,
                        'organizationId': notification.data.organizationId
                    });
                }
            }
        });
    }
}

export class NewMessageEventParams {
    /**
     * @type {string}
     */
    proposalId;
    /**
     * @type {string}
     */
    organizationId;
}