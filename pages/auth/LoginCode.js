import React from 'react';
import {Alert, Platform, ScrollView, StyleSheet, View} from "react-native";
import AS from '@react-native-community/async-storage'
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import PropTypes from "prop-types";
import type {LoginResponse} from "../../types/LoginResponse";
import trackEvent from "../../helpers/AppsFlyer";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";
import {firstLunchDone, initMessages} from '../../helpers/Luncher';
import Push from "../../helpers/Push";
import CodeInput from "./CodeInput";
import {ifIphoneX} from "react-native-iphone-x-helper";
import {Styles} from "../../styles/Global";
import config from "../../Config";
import GlobalState from "../../models/GlobalState";
import log from "../../helpers/firebaseAnalytic";

export default class LoginCode extends React.Component {

    state = {
        phone: this.props.phone,
        code: '',
        buttonDisabled: true,
        showPlaceholder: false
    };

    codeChange = (code: string) => {
        if (code.length >= config.smsCodeLength) {
            this.setState({code: code, buttonDisabled: false});
        }
    };

    nextPage = () => {

        let state = new GlobalState();
        let code = state.AuthCode;


        this.setState({showLoginBtn: false});
        if (code !== this.state.code) {
            Alert.alert('Неверный код');
        } else {
            const api = new Client();
            api.login(this.state.phone, this.state.code)
                .then((response: LoginResponse) => {
                    if (response.hasOwnProperty('error')) {
                        this.setState({showError: true})
                    } else {
                        AS.multiSet([['battle@token', response.access_token], ['battle@id', response.id]], () => Actions.BattleList({token: response.access_token}))
                            .then(() => {
                                trackEvent(
                                    'login', {
                                        id: response.id
                                    });
                                firstLunchDone();
                                initMessages(response.id);

                                let gs = new GlobalState();
                                gs.userId = response.id;
                                Push.saveToken();
                                Push.instance.setReceiveHandler();
                                log(this, 'login_btn', {userId: response.id})
                            })
                    }
                    this.setState({showLoginBtn: true});
                })   // Successfully logged in
            // .then(access_token => this.saveToken(access_token))    // Remember your credentials
        }
    };

    render() {
        log(this, 'render');
        return (
            <View style={styles.container}>
                <ScrollView style={Styles.rootView}>
                    <View style={{margin: 10, maxWidth: 300}}>
                        <View style={{justifyContent: 'flex-start'}}>
                            <View style={{height: 100, opacity: .5}}>
                                <Input
                                    showPlaceholder={true}
                                    style={{marginBottom: 50}}
                                    descriptionStyle={styles.descriptionStyle}
                                    description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                                    active={false}
                                    placeholder='Номер телефона'
                                    showError={false}
                                >
                                    <TextInputMask
                                        refInput={ref => {
                                            this.input = ref
                                        }}
                                        value={this.props.phone}
                                        // value={'+7 (999) 999 99 99'}
                                        onChangeText={() => {
                                        }}
                                        keyboardType="phone-pad"
                                        placeholder='Номер телефона'
                                        placeholderTextColor="#000"
                                        style={styles.maskInput}
                                        mask={"+7 ([000]) [000] [00] [00]"}
                                        autoCorrect={false}
                                    />
                                </Input>
                            </View>

                            <View style={{height: 100}}>
                                <Input
                                    style={{}}
                                    showPlaceholder={this.state.showPlaceholder}
                                    descriptionStyle={styles.descriptionStyle}
                                    placeholder='Код подтверждения'
                                    inputStyle={{borderBottomWidth: 0}}
                                    showError={false}
                                >
                                    <CodeInput
                                        onFocus={() => this.setState({showPlaceholder: true})}
                                        onBlur={() => this.setState({showPlaceholder: false})}
                                        phone={this.props.phone}
                                        name={this.state.userName}
                                        codeChange={this.codeChange}
                                    />
                                </Input>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonWrapper}>
                    <Button
                        disabled={this.state.buttonDisabled}
                        title="Продолжить"
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        )
    }
}

LoginCode.propTypes = {
    phone: PropTypes.string,
};

const styles = StyleSheet.create({
    descriptionStyle: {
        ...Platform.select({
            ios: {},
            android: {
                marginLeft: 0,
            },
        }),
    },
    buttonWrapper: {
        padding: 10,
        width: '100%',
        ...ifIphoneX({
            marginBottom: 50
        })
    },
    maskInput: {
        color: '#0C20E3',
        ...Platform.select({
            ios: {
                paddingBottom: 4
            },
            android: {
                paddingBottom: 0,
                marginLeft: -5,
                paddingTop: 0
            },
        }),
    },

    textInput: {
        color: '#0C20E3',
        fontSize: 15,
        lineHeight: 18,
        ...Platform.select({
            ios: {
                paddingTop: 20,
                paddingBottom: 5
            },
            android: {
                marginLeft: -5,
                paddingBottom: 0,
                paddingTop: 0
            },
        }),
    },

    container: {
        paddingTop: 30,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});
