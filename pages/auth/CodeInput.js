import React from 'react';
import {StyleSheet, Text, TextInput, View} from "react-native";
import ReSendCode from './ReSendCode';
import {plural} from '../../helpers/StringHelper';
import Client from "../../http/Client";
import type {LoginResponse} from "../../types/LoginResponse";

const SECONDS_COUNT = 60;

export default class CodeInput extends React.Component {

    timer: number;

    seconds = SECONDS_COUNT;

    state = {
        timerText: 'Повторно код можно будет отправить через 1 минуту',
        showButton: false
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

            });



    }

    renderButton() {
        if (this.state.showButton) {
            return <ReSendCode phone={this.props.phone} onPress={() => this.resend()}/>
        }
        return null;
    }

    render() {

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={style.inputWrapper}>
                    <View>
                        <TextInput
                            placeholder="Код подтверждения"
                            onChangeText={(code) => this.props.codeChange(code)}
                            keyboardType="numeric"

                        />
                    </View>
                    <View style={{width: 16,}}>
                        {this.renderButton()}
                    </View>
                </View>
                <View style={{marginTop: 10}}>
                    <Text>{this.state.timerText}</Text>
                </View>
            </View>
        )

    }

}

const style = StyleSheet.create({
    inputWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,

        flexDirection: 'row',
        justifyContent: 'space-between',

    }
});