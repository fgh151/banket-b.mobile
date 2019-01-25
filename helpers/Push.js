import {AsyncStorage, Permissions, Platform} from "react-native";
import Client from '../http/Client';

import React from "react";


import type {RemoteMessage} from 'react-native-firebase';
import firebase from "react-native-firebase";

const FCM = firebase.messaging();
const FN = firebase.notifications();

export default class Push {

    url = '/api/v2/push';
    granted = false;

    constructor() {
        this.checkPermissions();
        this.setRecieveHandler();
    }

    checkPermissions() {
        FCM.hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.granted = true;
                    console.log('Push permission granted');
                    this.saveToken();
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            this.saveToken();
                        });
                }
            });
    }

    async saveToken() {
        const token = await FCM.getToken();

        console.log("Save token", token);

        AsyncStorage.getItem('battle@id')
            .then((userId) => {
                const api = new Client();
                api.POST(this.url, {
                    user: userId,
                    token: token,
                    device: Platform.OS,
                })
            })
    }

    setRecieveHandler() {
        FN.onNotification((notification: Notification) => {
            console.log("notify recieved", notification);
            // Process your notification as required
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
            firebase.notifications()
                .displayNotification(notification);

        });
    }

}