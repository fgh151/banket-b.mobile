import React from 'react';
import {Platform, StyleSheet, TextInput, View} from "react-native";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";
import type {LoginResponse} from "../../types/LoginResponse";
import {ifIphoneX} from "react-native-iphone-x-helper";

export default class RegisterPhone extends React.Component {
    state = {
        phone: null,
        name: null,
        buttonDisabled: true
    };

    nextPage = () => {
        console.log(this.state);
        const api = new Client();
        api.POST('/v2/auth/sendcode', {phone: this.state.phone, name: this.state.name})
            .then((response: LoginResponse) => {
            });
        Actions.RegisterCode({phone: this.state.phone, userName: this.state.name});
    };
    phoneChange = (formatted: string, extracted: string) => {
        if (extracted.length === 10) {
            this.setState({phone: formatted, buttonDisabled: false});
        }
    };

    nameChange = (name) => {
        this.setState({name: name});
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{margin: 10, maxWidth: 300}}>
                    <View style={{justifyContent: 'flex-start', marginTop: 25}}>
                        <View style={{height: 60}}>
                            <Input
                                component={<TextInput
                                    placeholderTextColor={'#000000'}
                                    style={styles.textInput}
                                    placeholder="Имя"
                                    value={this.state.name}
                                    onChangeText={this.nameChange}
                                />}
                                style={{marginBottom: 0}}
                            />
                        </View>
                        <View style={{height: 100, marginTop:10}}>

                            <Input
                                component={<TextInputMask
                                    refInput={ref => {
                                        this.input = ref
                                    }}
                                    onChangeText={this.phoneChange}
                                    keyboardType="phone-pad"
                                    placeholder='Номер телефона'
                                    placeholderTextColor="#000"
                                    style={styles.maskInput}
                                    mask={"+7 ([000]) [000] [00] [00]"}
                                />}
                                style={{marginBottom: 50}}
                                description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                                active={true}
                                valid={true}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.buttonWrapper}>
                    <Button
                        disabled={this.state.buttonDisabled}
                        title="Создать батл"
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    buttonWrapper: {
        padding: 10,
        width: '100%',
        ...ifIphoneX({
            marginBottom: 50
        })
    },

    textInput: {
        color:'#000000',
        fontSize: 15,
        ...Platform.select({
            ios: {
                paddingTop: 0,
                paddingBottom: 7
            },
            android: {
                marginLeft: -5
            },
        }),
    },

    maskInput: {
        color: '#0C20E3',
        ...Platform.select({
            ios: {
                // paddingTop:20,
                paddingBottom: 4
            },
            android: {
                paddingBottom: 0,
                marginLeft: -5
            },
        }),
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});
