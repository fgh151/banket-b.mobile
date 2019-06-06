import React from 'react';
import {AppState, AsyncStorage, Platform, StyleSheet} from "react-native"
import {Actions, Router, Scene} from "react-native-router-flux";
import WhatIsIt from './pages/WhatIsIt';
import BattleList, {RightButton} from './pages/BattleList/BattleList'
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

import {setCustomText, setCustomTextInput,} from 'react-native-global-props';
import {funnel, OPEN_APP_EVENT} from "./components/Funnel";
import GlobalState from "./models/GlobalState";

import Feedback from './pages/feedback/Feedback';
import FeedbackDone from './pages/feedback/FeedbackDone';

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
                let gs = new GlobalState();
                gs.userId = userId;
                // Sentry.setUserContext({
                //     id: userId
                // })
            });

        funnel.catchEvent(OPEN_APP_EVENT);
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
                        titleStyle={localStyle.titleStyle}
                        renderBackButton={() => {
                        }}
                        hideNavBar={true}
                        key="WhatIsIt"
                        component={WhatIsIt}
                        title="Что это"
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="LoginPhone"
                        navigationBarStyle={Styles.navBar}
                        component={LoginPhone}
                        title="Вход"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="LoginCode"
                        navigationBarStyle={Styles.navBar}
                        component={LoginCode}
                        title="Вход"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                        // initial={true}
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="RegisterPhone"
                        navigationBarStyle={Styles.navBar}
                        component={RegisterPhone}
                        title="Регистрация"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                        // initial={true}
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="RegisterCode"
                        navigationBarStyle={Styles.navBar}
                        component={RegisterCode}
                        title="Регистрация"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                        // initial={true}
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="Form"
                        component={Form}
                        title="Создать батл"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                        // initial={true}

                    />
                    <Scene
                        key="BattleList"
                        component={BattleList}
                        title="Ваши батлы"
                        titleStyle={localStyle.titleStyle}
                        renderLeftButton={<Menu image="menu" buttons={[

                            {
                                action: () => {
                                    Actions.Feedback();
                                },
                                title: 'Связаться с нами'
                            },
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
                        titleStyle={localStyle.titleStyle}
                        key="Services"
                        component={Services}
                        title="Выберите услуги"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}

                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
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
                        titleStyle={localStyle.titleStyle}
                        key="DialogList"
                        component={DialogList}
                        title="DialogList"
                        navigationBarStyle={{height: 90}}
                        renderTitle={<ProposalBar/>}
                        renderBackButton={() => <BackButton style={localStyle.androidBackButtonTop}/>}
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
                        titleStyle={localStyle.titleStyle}
                        key="Messenger"
                        component={Messenger}
                        title="Чат"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="CitySelector"
                        component={CitySelector}
                        title="Выберите город"
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                    />
                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key={'RestaurantCard'}
                        component={RestaurantCard}
                        hideNavBar={true}
                        // initial={true}
                    />

                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="Feedback"
                        title={'Связаться с нами'}
                        component={Feedback}
                        renderBackButton={() => <BackButton style={localStyle.androidBackButton}/>}
                    />

                    <Scene
                        titleStyle={localStyle.titleStyle}
                        key="FeedbackDone"
                        title={'Связаться с нами'}
                        component={FeedbackDone}
                        back={false}
                        renderBackButton={() => {
                        }}
                        renderLeftButton={() => {
                        }}
                        renderRightButton={() => {
                        }}
                        // initial={true}
                    />

                </Scene>
            </Router>
        );
    }
}

const localStyle = StyleSheet.create({
    titleStyle: {
        fontFamily: "Lato-Bold"
    },
    androidBackButton: {
        ...Platform.select({
            ios: {},
            android: {
                paddingTop: 5
            },
        }),
    },
    androidBackButtonTop: {
        ...Platform.select({
            ios: {},
            android: {
                paddingTop: 3
            },
        }),
    },
});