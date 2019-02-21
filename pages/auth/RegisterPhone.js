import React from 'react';
import {Platform, StyleSheet, TextInput, View} from "react-native";
import {Styles} from "../../styles/Global";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";
import type {LoginResponse} from "../../types/LoginResponse";

export default class RegisterPhone extends React.Component {
    state = {
        phone: '',
        name: '',
        buttonDisabled: true
    };

    nextPage = () => {

        const api = new Client();
        api.POST('/v2/auth/sendcode', {phone: this.state.phone, name: this.state.name})
            .then((response : LoginResponse) => {
            });
        Actions.RegisterCode({phone: this.state.phone, name: this.state.name});
    };
    phoneChange = (formatted: string, extracted: string) => {
        if (extracted.length === 10) {
            this.setState({phone: formatted, buttonDisabled: false});
        }
    };

    nameChange = (name) => {
        this.setState({name:name});
    };

    render() {
        return (
            <View style={Styles.rootViewWrapper}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0.2}}>
                        <Input
                            component={<TextInput
                                style={styles.textInput}
                                placeholder="Имя"
                                onChangeText={this.nameChange}
                            />}
                        />
                    </View>
                    <View style={{flex: 0.2}}><Input
                        component={<TextInputMask
                            refInput={ref => {
                                this.input = ref
                            }}
                            onChangeText={this.phoneChange}
                            keyboardType="phone-pad"
                            placeholder='Номер телефона'
                            placeholderTextColor="#000"
                            style={{color: '#0C20E3'}}
                            mask={"+7 ([000]) [000] [00] [00]"}
                        />}
                        description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                        active={true}
                        valid={true}
                    />
                    </View>
                </View>
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