import React from 'react';
import {AsyncStorage, Text} from "react-native"
import {Actions, Router, Scene} from "react-native-router-flux";
import WhatIsIt from './pages/WhatIsIt';
// import Login from './pages/Login';
import BattleList from './pages/BattleList/BattleList'
import {isFirstLunch} from './helpers/Luncher';

import SplashScreen from 'react-native-splash-screen'

import firebase from 'react-native-firebase';

import {Styles} from "./styles/Global";

import LoginPhone from "./pages/auth/LoginPhone";
import Menu from './components/Menu';
import LoginCode from "./pages/auth/LoginCode";

import Form from './pages/create/Form';
import Services from "./pages/create/Services";
import Finish from "./pages/create/Finish";
import DialogList from './pages/messeger/DialogList'
import ProposalBar, {getCurrentProposal} from "./components/ProposalBar";
import BackButton from './components/BackButton';
import Messenger from "./pages/messeger/Messenger";
import GeoLocation from "./helpers/GeoLocation";
import CitySelector from './pages/create/CitySelector';
import RegisterPhone from "./pages/auth/RegisterPhone";
import RegisterCode from "./pages/auth/RegisterCode";
import Client from "./http/Client";

// Sentry.config(config.sentryDSN).install();


export default class App extends React.Component {


    static PROPOSALS_CACHE_KEY = 'my-proposals';
    state = {
        firstLunch: false
    };

    constructor() {
        super();
        isFirstLunch().then((value) => {
            if (value !== true.toString()) {
                this.state.firstLunch = true
                // this.setState({firstLunch: true});
            }
        });
    }

    componentDidMount() {


        new GeoLocation();


        SplashScreen.hide();

        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        // console.log("LOG: ", token);
                    })
                    // user has permissions
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            // alert("User Now Has Permission")
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
            <Router
                sceneStyle={{backgroundColor: '#ffffff'}}
                titleStyle={{textAlign: 'center'}}
            >
                <Scene key="root" hideNavBar={false} title="Банкетный баттл">
                    <Scene
                        style={{backgroundColor: 'red'}}
                        hideNavBar={true}
                        key="WhatIsIt"
                        component={WhatIsIt}
                        title="Что это"
                        initial={this.state.firstLunch} //Главный экран ?
                    />
                    <Scene
                        key="LoginPhone"
                        navigationBarStyle={Styles.navBar}
                        component={LoginPhone}
                        title="Вход"
                    />
                    <Scene
                        key="LoginCode"
                        navigationBarStyle={Styles.navBar}
                        component={LoginCode}
                        title="Вход"
                    />
                    <Scene
                        key="RegisterPhone"
                        navigationBarStyle={Styles.navBar}
                        component={RegisterPhone}
                        title="Регистрация"
                    />
                    <Scene
                        key="RegisterCode"
                        navigationBarStyle={Styles.navBar}
                        component={RegisterCode}
                        title="Регистрация"
                    />
                    <Scene
                        key="Form"
                        component={Form}
                        title="Создать батл"
                        renderBackButton={() => {}}
                    />
                    <Scene
                        key="BattleList"
                        component={BattleList}
                        title="Ваши батлы"
                        initial={!this.state.firstLunch} //Главный экран ?
                        renderLeftButton={<Menu image="menu" buttons={[
                            {
                                action: () => {
                                    AsyncStorage.clear(() => Actions.WhatIsIt())
                                },
                                title: 'Выйти'
                            }
                        ]}/>}
                        renderRightButton={
                            <Text
                                style={{
                                    color: '#0C20E3',
                                    fontSize: 18,
                                    textAlign: 'right', marginRight: 15
                                }}
                                onPress={() => Actions.Form()}
                            >
                                Новый батл
                            </Text>
                        }
                    />
                    <Scene key="Create" component={BattleList}/>


                    <Scene
                        key="Services"
                        component={Services}
                        title="Выберите услуги"
                        renderBackButton={() => <BackButton/>}
                    />
                    <Scene
                        key="Finish"
                        component={Finish}
                        title="Батл создан"
                        back={false}
                        renderBackButton={() => {}}
                    />
                    <Scene
                        key="DialogList"
                        component={DialogList}
                        title="DialogList"
                        navigationBarStyle={{height: 109}}
                        renderTitle={<ProposalBar/>}
                        renderBackButton={() => <BackButton/>}
                        // renderRightButton={<ProposalMenu />}
                        renderRightButton={<Menu image="dots" buttons={[
                            {
                                action: () => {
                                    let p = getCurrentProposal();
                                    const api = new Client(result);
                                    api.GET('/proposal/close/' + p.id)
                                        .then(
                                            () => {
                                                Actions.BattleList();
                                            }
                                        );
                                },
                                title: 'Закончить батл'
                            }
                        ]}/>}
                    />

                    <Scene
                        key="Messenger"
                        component={Messenger}
                        title="Чат"
                        renderBackButton={() => <BackButton/>}
                        // renderTitle={<ChangeableTitle/>}
                        // renderRightButton={() => <DialogHelp/>}
                        // renderBackButton={() => <BackButton/>}
                    />

                    <Scene
                        key="CitySelector"
                        component={CitySelector}
                        title="Выберите город"
                        renderBackButton={() => <BackButton/>}
                    />

                </Scene>
            </Router>
        );
    }
}
