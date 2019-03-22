import React from 'react';
import {Keyboard, Platform, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {Styles} from "../../styles/Global";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";
import {ifIphoneX} from "react-native-iphone-x-helper";
import {isEmpty} from "../../helpers/StringHelper";

export default class LoginPhone extends React.Component {

    constructor() {
        super();
        this.state = {
            phone: '',
            buttonDisabled: true,
            showPlaceholder: false,
            inputFocus: false,
            currentValue:'',
        }
    }

    nextPage = () => {
        Client.sendCode(this.state.phone)
            .then(() => Actions.LoginCode({phone: this.state.phone}));
    };

    phoneChange = (formatted: string, extracted: string) => {

        let state = {currentValue: formatted};

        if (extracted.length === 10) {
            state.phone = formatted;
            state.buttonDisabled = false;
        } else  {
            state.buttonDisabled = true;
        }
        this.setState(state);
    };

    togglePlaceHolder() {
        let show = false;
        if (!isEmpty(this.state.currentValue)) {
            show = true;
        } else if (this.state.inputFocus)  {
            show = true;
        }
        this.setState({showPlaceholder: show})
    }

    render() {
        return (
            <View style={[Styles.rootViewWrapper, {marginTop: 35}]}>
                <TouchableOpacity onPress={() => (Keyboard.dismiss())} style={{flex: .92}}>
                    <View style={{marginRight: 20, marginLeft: 20}}>
                        <Input
                            inputStyle={styles.textInput}
                            description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                            showPlaceholder={this.state.showPlaceholder}
                            error={''}
                            placeholder={'Номер телефона'}
                        >
                            <TextInputMask
                                refInput={ref => {
                                    this.input = ref
                                }}
                                onFocus={() => {this.setState({inputFocus: true}, () => this.togglePlaceHolder())}}
                                onBlur={()=>{this.setState({inputFocus: false}, () => this.togglePlaceHolder())}}

                                onChangeText={this.phoneChange}
                                keyboardType="phone-pad"
                                placeholder='Номер телефона'
                                placeholderTextColor="#000"
                                style={styles.textInput}
                                mask={"+7 ([000]) [000] [00] [00]"}
                                value={this.state.phone}
                            />
                        </Input>
                    </View>
                </TouchableOpacity>
                    <View style={styles.buttonWrapper}>
                        <Button
                            style={{width: '100%'}}
                            disabled={this.state.buttonDisabled}
                            title="Продолжить"
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
        fontSize: 15,
        // marginRight:30,
        // marginLeft:30,

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
    }

});