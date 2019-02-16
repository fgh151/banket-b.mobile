import React from 'react';
import {Platform, StyleSheet, TextInput, View} from "react-native";
import {Styles} from "../../styles/Global";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import Client from '../../http/Client';
import type {LoginResponse} from "../../types/LoginResponse";
import {Actions} from "react-native-router-flux";

export default class LoginPhone extends React.Component{

    constructor () {
        super();
        this.state = {
            phone: '',
            buttonDisabled: true
        }
    }

    nextPage = () => {

        const api = new Client();
        api.POST('/v2/auth/sendcode', {phone: this.state.phone})
            .then((response : LoginResponse) => {
            });
        Actions.LoginCode({phone: this.state.phone});
    };

    phoneChange = (formatted : string, extracted: string) => {
        if (extracted.length === 10) {
            this.setState({phone: formatted, buttonDisabled: false});
        }
    };

    render() {
        return(
            <View style={Styles.rootView}>
                <Input
                    inputStyle={styles.textInput}
                    component={<TextInputMask
                        refInput={ref => { this.input = ref }}
                        onChangeText={this.phoneChange}
                        keyboardType="phone-pad"
                        placeholder='Номер телефона'
                        placeholderTextColor="#000"
                        style={styles.textInput}
                        mask={"+7 ([000]) [000] [00] [00]"}
                    />}
                    description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                    active={true}
                    valid={true}
                />
                <Button
                    disabled={this.state.buttonDisabled}
                    title="Продолжить"
                    onPress={this.nextPage}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput : {
        fontSize:15,
        color:'#0C20E3',
        ...Platform.select({
            ios: {
                paddingTop:20,
                paddingBottom:5
            },
            android: {
                marginLeft: -5
            },
        }),
    }

});