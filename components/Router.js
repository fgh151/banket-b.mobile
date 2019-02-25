import React from "react";
import {Actions} from "react-native-router-flux";
import {isFirstLunch} from "../helpers/Luncher";
import WhatIsIt from "../pages/WhatIsIt";
import {AsyncStorage} from "react-native";
import Push from "../helpers/Push";

export class Router extends React.Component{

    constructor() {
        super();


        isFirstLunch().then((value) => {
            if (value !== true.toString()) {
                Actions.WhatIsIt()
            } else {
                AsyncStorage.getItem('battle@token')
                    .then((result) => {

                        // console.log('User token', result);
                        if (result === null) {
                            Actions.LoginPhone();
                        } else {
                            let push = new Push();
                            Push.saveToken();
                            // push.setRecieveHandler();
                            Actions.BattleList();
                        }
                    });
            }
        });


    }

    render(){return null;}
}