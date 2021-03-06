import React from 'react';
import {Platform, StyleSheet, View} from "react-native";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";
import {ifIphoneX} from "react-native-iphone-x-helper";
import {isEmpty} from "../../helpers/StringHelper";
import log from "../../helpers/firebaseAnalytic";

export default class LoginPhone extends React.Component {

    constructor() {
        super();
        this.state = {
            phone: '',
            buttonDisabled: true,
            showPlaceholder: false,
            inputPhoneFocus: false,
            currentPhoneValue: '',
            phonePlaceholder: 'Номер телефона'
        }
    }

    nextPage = () => {
        Client.sendCode({phone: this.state.phone});
        Actions.LoginCode({phone: this.state.phone});
        log(this, 'login_btn');
    };

    phoneChange = (formatted: string, extracted: string) => {

        let state = {currentPhoneValue: formatted};

        if (extracted.length === 10) {
            state.phone = formatted;
            state.buttonDisabled = false;
        } else {
            state.buttonDisabled = true;
        }
        this.setState(state);
        log(this, 'phone_input_change');
    };

    togglePhonePlaceHolder() {
        let show = false;
        if (!isEmpty(this.state.currentPhoneValue)) {
            show = true;
        } else if (this.state.inputPhoneFocus) {
            show = true;
        }
        this.setState({showPhonePlaceholder: show})
    }

    render() {
        log(this, 'render');
        return (
            <View style={styles.container}>
                <View style={{margin: 10, maxWidth: 300}}>
                    <View style={{justifyContent: 'flex-start', marginTop: 25}}>
                        <View style={{height: 100, marginTop: 10}}>
                            <Input
                                style={{marginBottom: 50}}
                                descriptionStyle={styles.descriptionStyle}
                                description="Вам будет отправлен код подтверждения по СМС на этот телефонный номер"
                                placeholder='Номер телефона'
                                showPlaceholder={this.state.showPhonePlaceholder}
                                showError={false}
                            >
                                <TextInputMask
                                    refInput={ref => {
                                        this.input = ref
                                    }}
                                    onChangeText={this.phoneChange}
                                    onFocus={() => {

                                        log(this, 'phone_input_focus');
                                        this.setState({
                                            inputPhoneFocus: true,
                                            phonePlaceholder: '',
                                            currentPhoneValue: this.state.currentPhoneValue ? this.state.currentPhoneValue : '+7 ('
                                        }, () => this.togglePhonePlaceHolder())
                                    }}
                                    onBlur={() => {
                                        log(this, 'phone_input_blur');
                                        this.setState({
                                            inputPhoneFocus: false,
                                            phonePlaceholder: 'Номер телефона'
                                        }, () => this.togglePhonePlaceHolder())
                                    }}
                                    keyboardType="phone-pad"
                                    placeholder={this.state.phonePlaceholder}
                                    placeholderTextColor="#000"
                                    style={styles.maskInput}
                                    mask={"+7 [000] [000] [00] [00]"}
                                    autoCorrect={false}
                                    value={this.state.currentPhoneValue}
                                    returnKeyType={'done'}
                                />
                            </Input>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonWrapper}>
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
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});
