import React from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from "react-native";
import ReSendCode from './ReSendCode';
import {plural} from '../../helpers/StringHelper';
import Client from "../../http/Client";
import type {LoginResponse} from "../../types/LoginResponse";
import GlobalState from "../../models/GlobalState";

const SECONDS_COUNT = 60;

export default class CodeInput extends React.Component {

    timer: number;

    seconds = SECONDS_COUNT;

    state = {
        timerText: 'Повторно код можно будет отправить через 1 минуту',
        showButton: false,
        placeholderText: 'Код подтверждения',
        currentCode: ''
    };

    constructor(props) {
        super(props);
        this.secondTick = this.secondTick.bind(this);
    }

    secondTick() {
        this.seconds--;
        if (this.seconds === 0) {
            clearInterval(this.timer);
            this.setState({
                timerText: '',
                showButton: true
            });
            clearInterval(this.timer);
            this.seconds = SECONDS_COUNT;
        } else {
            this.setState({
                timerText: "Повторно код можно будет отправить через " + this.seconds + " " + plural(this.seconds, 'секунду', 'секунды', 'секунд')
            })
        }
    }

    componentDidMount() {
        this.timer = setInterval(this.secondTick, 1000)
    }

    resend() {
        clearInterval(this.timer);
        this.setState({
            timerText: 'Повторно код можно будет отправить через 1 минуту',
            showButton: false
        });
        this.timer = setInterval(this.secondTick, 1000);
        this.seconds = SECONDS_COUNT;

        const api = new Client();
        api.POST('/v2/auth/sendcode', {phone: this.props.phone, name: this.props.name})
            .then((response: LoginResponse) => {
                let state = new GlobalState();
                state.AuthCode = response.code;
            });
    }

    renderButton() {
        if (this.state.showButton) {
            return <ReSendCode phone={this.props.phone} onPress={() => this.resend()}/>
        }
        return null;
    }

    renderTimerText() {
        if (this.state.timerText !== '') {
            return (
                <View style={{marginTop: 10}}>
                    <Text style={{
                        fontSize: 13,
                        lineHeight: 16,
                        fontFamily: "Lato-Regular", opacity: .5
                    }}>{this.state.timerText}</Text>
                </View>
            );
        }
        return null;
    }

    render() {

        return (
            <View>
                <View style={style.inputWrapper}>
                    <View>
                        <TextInput
                            onFocus={() => {
                                let placeholder = '';
                                this.setState({placeholderText: placeholder});
                                this.props.onFocus()
                            }}
                            onBlur={() => {
                                let placeholder = this.state.currentCode !== '' ? this.state.currentCode : 'Код подтверждения';
                                this.setState({placeholderText: placeholder});
                                this.props.onBlur()
                            }}
                            value={this.state.currentCode}
                            placeholderTextColor={'#000000'}
                            placeholder={this.state.placeholderText}
                            onChangeText={(code) => {
                                this.props.codeChange(code);
                                this.setState({currentCode: code})
                            }}
                            keyboardType="numeric"
                            style={{fontSize: 15, lineHeight: 18, padding: 0, fontFamily: "Lato-Regular", width: 280}}
                            autoCorrect={false}
                            returnKeyType={'done'}
                        />
                    </View>
                    <View>
                        {this.renderButton()}
                    </View>
                </View>
                {this.renderTimerText()}
            </View>
        )
    }
}

const style = StyleSheet.create({
    inputWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',

        ...Platform.select({
            ios: {
                paddingBottom: 5
            },
            android: {},
        }),
    }
});