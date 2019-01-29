import React from 'react';

import {Actions, Reducer, Router, Scene} from "react-native-router-flux";
import WhatIsIt from './pages/WhatIsIt';
import HowItWork from './pages/HowItWork';
import Login from './pages/Login';
import Register from './pages/Register';
import config from './Config';
import BattleList from './pages/BattleList'
import {isFirstLunch} from './helpers/Luncher';

import SplashScreen from 'react-native-splash-screen'

import firebase from 'react-native-firebase';

import { Sentry } from 'react-native-sentry';
Sentry.config(config.sentryDSN).install();

export default class App extends React.Component {


    static PROPOSALS_CACHE_KEY = 'my-proposals';

    constructor() {
        super();
        this.state = {
            firstLunch : true
        };

        isFirstLunch().then((value) => {
            if (value === false.toString()) {
                this.setState({firstLunch: false});
            }
        })
    }

    componentDidMount() {
        SplashScreen.hide();
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        console.log("LOG: ", token);
                    })
                    // user has permissions
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            alert("User Now Has Permission")
                        })
                        .catch(error => {
                            alert("Error", error)
                            // User has rejected permissions
                        });
                }
            });
    }

    render() {
        return (
            <Router>
                <Scene key="root" hideNavBar={false} title="Банкетный баттл">
                    <Scene
                        key="WhatIsIt"
                        component={WhatIsIt}
                        title="Что это"
                        initial={this.state.firstLunch} //Главный экран ?
                    />
                    <Scene
                        key="HowItWork"
                        component={HowItWork}
                        title="Как это работает"
                    />
                    <Scene
                        key="Login"
                        component={Login}
                        title="Login"
                    />
                    <Scene
                        key="Register"
                        component={Register}
                        title="Login"
                    />
                    <Scene
                        key="BattleList"
                        component={BattleList}
                        title="List"
                        initial={!this.state.firstLunch} //Главный экран ?
                    />
                </Scene>
            </Router>
        );
    }
}
