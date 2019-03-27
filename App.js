import React from 'react';
import {AppState, AsyncStorage, Platform, StyleSheet} from "react-native"
import {Actions, Router, Scene} from "react-native-router-flux";
import WhatIsIt from './pages/WhatIsIt';
import BattleList from './pages/BattleList/BattleList'
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
import ProposalMenu from './components/ProposalMenu';
import BackButton from './components/BackButton';
import Messenger from "./pages/messeger/Messenger";
import GeoLocation from "./helpers/GeoLocation";
import CitySelector from './pages/create/CitySelector';
import RegisterPhone from "./pages/auth/RegisterPhone";
import RegisterCode from "./pages/auth/RegisterCode";
import Client from "./http/Client";
import {Router as AppRouter} from './components/Router';
import appsFlyer from 'react-native-appsflyer';
import RestaurantCard from './pages/RestaurantCard';
import {RightButton} from "./pages/BattleList/BattleList";

import {
    setCustomTextInput,
    setCustomText,
} from 'react-native-global-props';
import Sentry from "react-native-sentry";

const customFont = {
    fontFamily: "Lato-Regular",
};
setCustomText(customFont);
setCustomTextInput(customFont);


export default class App extends React.Component {
    state = {
        appState: AppState.currentState,
    };

    componentDidMount() {

        // AppState.addEventListener('change', this._handleAppStateChange);
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
                            // alert("Error", error) //TODO: iphone
                            // User has rejected permissions
                        });
                }
            });

        AsyncStorage.getItem('battle@id')
            .then((userId) => {
                Sentry.setUserContext({
                    id: userId
                })
            });
    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            if (Platform.OS === 'ios') {
                appsFlyer.trackAppLaunch();
            }
            //App has come to the foreground!
            // SplashScreen.hide();
        }
        this.setState({appState: nextAppState});
    };

    render() {
        return (
            <Router
                sceneStyle={{backgroundColor: '#ffffff'}}
            >
                <Scene
                    key="root"
                    hideNavBar={false}
                    title="Банкетный баттл"
                    titleStyle={{textAlign: 'center', fontWeight: 'bold', fontSize: 15}}
                >
                    <Scene
                        key={'router'}
                        component={AppRouter}
                        hideNavBar={true}
                    />

                    <Scene
                        renderBackButton={() => {
                        }}
                        hideNavBar={true}
                        key="WhatIsIt"
                        component={WhatIsIt}
                        title="Что это"
                    />
                    <Scene
                        key="LoginPhone"
                        navigationBarStyle={Styles.navBar}
                        component={LoginPhone}
                        title="Вход"
                        renderBackButton={() => <BackButton/>}
                    />
                    <Scene
                        key="LoginCode"
                        navigationBarStyle={Styles.navBar}
                        component={LoginCode}
                        title="Вход"
                        renderBackButton={() => <BackButton/>}
                    />
                    <Scene
                        key="RegisterPhone"
                        navigationBarStyle={Styles.navBar}
                        component={RegisterPhone}
                        title="Регистрация"
                        renderBackButton={() => <BackButton/>}

                    />
                    <Scene
                        key="RegisterCode"
                        navigationBarStyle={Styles.navBar}
                        component={RegisterCode}
                        title="Регистрация"
                        renderBackButton={() => <BackButton/>}
                    />
                    <Scene
                        key="Form"
                        component={Form}
                        title="Создать батл"
                        renderBackButton={() => <BackButton/>}
                    />
                    <Scene
                        key="BattleList"
                        component={BattleList}
                        title="Ваши батлы"
                        renderLeftButton={<Menu image="menu" buttons={[
                            {
                                action: () => {
                                    AsyncStorage.clear(() => Actions.WhatIsIt())
                                },
                                title: 'Выйти'
                            }
                        ]}/>}
                        renderRightButton={<RightButton/>}
                    />

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
                        renderBackButton={() => {
                        }}
                        renderLeftButton={() => {
                        }}
                        renderRightButton={() => {
                        }}

                    />
                    <Scene
                        key="DialogList"
                        component={DialogList}
                        title="DialogList"
                        navigationBarStyle={{height: 90}}
                        renderTitle={<ProposalBar/>}
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                        renderRightButton={
                            <ProposalMenu
                                image="dots"
                                getProposal={getCurrentProposal}
                                buttons={[
                                    {
                                        action: () => {
                                            let p = getCurrentProposal();
                                            AsyncStorage.getItem('battle@token')
                                                .then((result) => {
                                                    const api = new Client(result);
                                                    api.GET('/proposal/close/' + p.id)
                                                        .then(
                                                            () => {
                                                                Actions.refresh();
                                                                Actions.BattleList();
                                                            }
                                                        )
                                                });
                                            Actions.BattleList();
                                        },
                                        title: 'Закончить батл'
                                    }
                                ]}/>
                        }
                    />

                    <Scene
                        key="Messenger"
                        component={Messenger}
                        title="Чат"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                    />
                    <Scene
                        key="CitySelector"
                        component={CitySelector}
                        title="Выберите город"
                        renderBackButton={() => <BackButton/>}
                    />
                    <Scene
                        key={'RestaurantCard'}
                        component={RestaurantCard}
                        hideNavBar={true}
                    />

                </Scene>
            </Router>
        );
    }
}

const localStyle = StyleSheet.create({
    androidBackButton: {
        ...Platform.select({
            ios: {},
            android: {
                paddingTop: 5
            },
        }),
    }
});