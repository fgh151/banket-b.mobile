import React from 'react';
import {AsyncStorage, Platform, StyleSheet, TextInput, View} from "react-native";
import {Styles} from "../../styles/Global";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import PropTypes from "prop-types";
import type {LoginResponse} from "../../types/LoginResponse";
import trackEvent from "../../helpers/AppsFlyer";
import Client from '../../http/Client';

import {firstLunchDone} from '../../helpers/Luncher';
import Proposal from "../../models/Proposal";
import Push from "../../helpers/Push";
import CodeInput from "./CodeInput";

export default class RegisterCode extends React.Component {

    state = {
        phone: this.props.phone,
        name: this.props.name,
        code: '',
        buttonDisabled: true
    };


    proposal = new Proposal();

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
                            const push = new Push();
                            Push.saveToken();
                            // push.setRecieveHandler();
                            this.proposal.save();
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
            <View style={styles.container}>
                <View style={{margin: 10, maxWidth: 300}}>
                    <View style={{justifyContent: 'flex-start'}} >
                        <View style={{height: 100}}>
                            <Input
                                component={<TextInput
                                    style={styles.textInput}
                                    placeholder="Имя"
                                    value={this.props.name}
                                    onChangeText={this.nameChange}
                                />}
                                style={{marginBottom: 50}}
                                active={false}
                                valid={true}
                            />
                        </View>
                        <View style={{height: 100}}>

                            <Input
                                component={<TextInputMask
                                    refInput={ref => {
                                        this.input = ref
                                    }}
                                    value={this.props.phone}
                                    onChangeText={this.phoneChange}
                                    keyboardType="phone-pad"
                                    placeholder='Номер телефона'
                                    placeholderTextColor="#000"
                                    style={{color: '#0C20E3', paddingBottom: 5}}
                                    mask={"+7 ([000]) [000] [00] [00]"}
                                />}
                                style={{marginBottom: 50}}
                                description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                                active={false}
                                valid={true}
                            />
                        </View>

                        <View style={{height: 100}}>

                            <CodeInput phone={this.props.phone}/>
                        </View>
                    </View>
                </View>
                <View style={{padding: 10, width: '100%'}}>
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


RegisterCode.propTypes = {
    phone: PropTypes.string,
    name: PropTypes.string,
};

const wrapperStyle = [Styles.rootViewWrapper];


const styles = StyleSheet.create({
    textInput: {
        fontSize: 15,
        ...Platform.select({
            ios: {
                paddingTop: 20,
                paddingBottom: 5
            },
            android: {
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
