import {Vibration, AsyncStorage, Permissions, Platform, AppState} from "react-native";
import Client from '../http/Client';

import React from "react";


import type {RemoteMessage} from 'react-native-firebase';
import firebase from "react-native-firebase";
import {updateProposalList} from "../pages/BattleList/ProposalListItem";

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

                console.log(userId, token, Platform.OS);

                const api = new Client();
                api.POST(Push.url, {
                    user: userId,
                    token: token,
                    device: Platform.OS,
                })
            })
    }

    setRecieveHandler() {
        FN.onNotification((notification: Notification) => {

            if (AppState.currentState !== 'active') {

                console.log("notify recieved", notification);
                // Process your notification as required
                notification
                    .android.setChannelId('test-channel')
                    .android.setSmallIcon('ic_launcher');
                firebase.notifications()
                    .displayNotification(notification)
                    .then(() => {
                        Vibration.vibrate(100, [1000, 2000, 3000]);
                        updateProposalList();
                    });
            }

        });
    }

}