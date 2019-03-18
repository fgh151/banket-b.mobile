import {Vibration, AsyncStorage, Permissions, Platform, AppState} from "react-native";
import Client from '../http/Client';

import React from "react";



// import type {RemoteMessage} from 'react-native-firebase';
import firebase from "react-native-firebase";
import {updateProposalList} from "../pages/BattleList/ProposalListItem";
import GlobalState from "../models/GlobalState";

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
                const api = new Client();
                api.POST('/v2/push', {
                    user: userId,
                    token: token,
                    device: Platform.OS,
                }).then((s) => console.log(s))
                    .catch((e) => console.log(e));
            })
    }

    setRecieveHandler() {
        FN.onNotification((notification: Notification) => {
            if (AppState.currentState !== 'active') {
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

            let state = new GlobalState();
            if (state.DialogList !== null) {
                state.DialogList.getRemoteList();
            }
            if (state.BattleList !== null) {
                state.BattleList.getRemoteList();
            }

        });
    }

}