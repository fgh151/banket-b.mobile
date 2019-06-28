import React from "react";
import {Actions} from "react-native-router-flux";
import {isFirstLunch} from "../helpers/Luncher";
import AS from '@react-native-community/async-storage'
import {STORAGE_AUTH_TOKEN} from "../helpers/Constants";

export class Router extends React.Component {

    constructor() {
        super();

        isFirstLunch().then((value) => {
            if (value !== true.toString()) {
                Actions.WhatIsIt()
            } else {
                AS.getItem(STORAGE_AUTH_TOKEN)
                    .then((result) => {

                        // console.log('User token', result);
                        if (result === null) {
                            Actions.LoginPhone();
                        } else {
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