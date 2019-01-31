import React from 'react';

import {AsyncStorage, Button, TextInput, View} from 'react-native';
import type {LoginResponse} from "../types/LoginResponse";
import trackEvent from "../helpers/AppsFlyer";

export default class Register extends React.Component{

    constructor () {
        super();
        this.state = {
            name: '',
            phone: '',
            code: '',
            showLoginBtn: true
        }
    }

    getCode() {
        const api = new Client();
        api.GET('/v2/auth/sendcode', {phone: this.state.phone, name: this.state.name})
    }

    /**
     * TODO: redirect
     */
    register() {
        const api = new Client();
        api.login(this.state.email, this.state.code)
            .then((response : LoginResponse ) => {
                if (response.hasOwnProperty('error')) {
                    this.setState({showError: true})
                } else {
                    console.log(response);

                    AsyncStorage.multiSet([['battle@token', response.access_token], ['battle@id', response.id]])
                        .then(() => {
                            console.log('added');
                            trackEvent(
                                'registration', {
                                    email: this.state.email
                                });
                            Actions.main()
                        })
                        .catch(err => {this.setState({showLoginBtn: true}); console.log(err)});  // Catch any error
                }
                this.setState({showLoginBtn: true});
            })   // Successfully logged in
        // .then(access_token => this.saveToken(access_token))    // Remember your credentials
    }

    render() {
        return (
        <View style={{padding: 10}}>
            <TextInput
                style={{height: 40}}
                placeholder="name"
                onChangeText={(name) => this.setState({name})}
            />
            <TextInput
                style={{height: 40}}
                placeholder="phone"
                onChangeText={(phone) => this.setState({phone})}
            />
            <TextInput
                style={{height: 40}}
                placeholder="code"
                onChangeText={(code) => this.setState({code})}
            />
            <Button title={"GetCode"} onPress={()=> this.getCode()}/>
            <Button title={"Register"} onPress={()=> this.register()}/>
        </View>
        )
    }
}