import React from 'react';
import {AsyncStorage, View} from "react-native";
import {Styles} from "../../styles/Global";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import PropTypes from "prop-types";
import type {LoginResponse} from "../../types/LoginResponse";
import trackEvent from "../../helpers/AppsFlyer";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";

import {firstLunchDone} from '../../helpers/Luncher';
import Push from "../../helpers/Push";
import CodeInput from "./CodeInput";

export default class LoginCode extends React.Component {

    state = {
        phone: this.props.phone,
        code: '',
        buttonDisabled: true
    };

    codeChange = (code: string) => {

        console.log(code);
        console.log(code.length);

        if (code.length === 6) {
            this.setState({code: code, buttonDisabled: false});
        }
    };

    nextPage = () => {
        const api = new Client();
        api.login(this.state.phone, this.state.code)
            .then((response: LoginResponse) => {
                if (response.hasOwnProperty('error')) {
                    this.setState({showError: true})
                } else {
                    console.log(response);

                    AsyncStorage.multiSet([['battle@token', response.access_token], ['battle@id', response.id]])
                        .then(() => {
                            console.log('added');
                            trackEvent(
                                'login', {
                                    if: response.id
                                });
                            firstLunchDone();
                            Push.saveToken();
                            Actions.BattleList()
                        })
                        .catch(err => {
                            this.setState({showLoginBtn: true});
                            console.log(err)
                        });  // Catch any error
                }
                this.setState({showLoginBtn: true});
            })   // Successfully logged in
        // .then(access_token => this.saveToken(access_token))    // Remember your credentials
    };

    render() {
        return (
            <View style={wrapperStyle}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0.2, marginTop: 20}}>
                        <Input
                            component={<TextInputMask
                                refInput={ref => {
                                    this.input = ref
                                }}
                                keyboardType="phone-pad"
                                placeholder='Номер телефона'
                                placeholderTextColor="#000"
                                style={{color: '#0C20E3'}}
                                mask={"+7 ([000]) [000] [00] [00]"}
                                value={this.props.phone}
                            />}
                            description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                            active={false}
                            valid={true}
                        />
                    </View>
                    <View style={{flex: 0.2}}>
                        <CodeInput phone={this.props.phone} codeChange={this.codeChange}/>
                    </View>
                </View>

                <View style={Styles.rootViewBig}>
                    <Button
                        disabled={this.state.buttonDisabled}
                        title="Продолжить"
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        );
    }
}


LoginCode.propTypes = {
    phone: PropTypes.string,
};

const wrapperStyle = [Styles.rootViewWrapper];