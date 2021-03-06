import React from "react";
import {Actions} from "react-native-router-flux";
import {isFirstLunch} from "../helpers/Luncher";
import AS from '@react-native-community/async-storage'
import {STORAGE_AUTH_ID} from "../helpers/Constants";
import Push from "../helpers/Push";

export class Router extends React.PureComponent {

    constructor() {
        super();

        isFirstLunch().then((value) => {
            if (value !== true.toString()) {
                Push.clearNotifications();
                Actions.WhatIsIt()
            } else {
                AS.getItem(STORAGE_AUTH_ID)
                    .then((userId) => {

                        // console.log('User token', result);
                        if (userId === null) {
                            Actions.LoginPhone();
                        } else {
                            // initMessages(userId);
                            Actions.BattleList();
                        }
                    });
            }
        });
    }

    render() {
        return null;
    }
}
