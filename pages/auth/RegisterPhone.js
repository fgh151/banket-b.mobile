import React from 'react';
import {Platform, StyleSheet, TextInput, View} from "react-native";
import Input from "../../components/Input";
import TextInputMask from "react-native-text-input-mask";
import {Button} from "../../components/Button";
import Client from '../../http/Client';
import {Actions} from "react-native-router-flux";
import {ifIphoneX} from "react-native-iphone-x-helper";
import {isEmpty} from "../../helpers/StringHelper";
import log from "../../helpers/firebaseAnalytic";

export default class RegisterPhone extends React.Component {
    state = {
        phone: null,
        name: null,
        buttonDisabled: true,
        inputNameFocus: false,
        showNamePlaceholder: false,
        inputPhoneFocus: false,
        showPhonePlaceholder: false,

        currentPhoneValue: '',

        namePlaceholder: 'Имя',
        phonePlaceholder: 'Номер телефона'
    };

    nextPage = () => {
        Client.sendRegisterCode({phone: this.state.phone, name: this.state.name});
        Actions.RegisterCode({phone: this.state.phone, userName: this.state.name});
        log(this, 'register_btn');
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

    nameChange = (name) => {

        log(this, 'name_input_change');
        this.setState({name: name});
    };

    render() {
        log(this, 'render');
        return (
            <View style={styles.container}>
                <View style={{margin: 10, maxWidth: 300}}>
                    <View style={{justifyContent: 'flex-start', marginTop: 25}}>
                        <View style={{height: 50}}>
                            <Input
                                style={{marginBottom: 0}}
                                showPlaceholder={this.state.showNamePlaceholder}
                                placeholder="Имя"
                                showError={false}
                            >
                                <TextInput
                                    placeholderTextColor={'#000000'}
                                    style={styles.textInput}
                                    placeholder={this.state.namePlaceholder}
                                    value={this.state.name}
                                    onChangeText={this.nameChange}
                                    onFocus={() => {
                                        log(this, 'name_input_focus');
                                        this.setState({
                                            inputNameFocus: true,
                                            namePlaceholder: ''
                                        }, () => this.toggleNamePlaceHolder())
                                    }}
                                    onBlur={() => {
                                        log(this, 'name_input_blur');
                                        this.setState({
                                            inputNameFocus: false,
                                            namePlaceholder: 'Имя'
                                        }, () => this.toggleNamePlaceHolder())
                                    }}
                                    autoCorrect={false}
                                />
                            </Input>
                        </View>
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
        )
    }

    toggleNamePlaceHolder() {
        let show = false;
        if (!isEmpty(this.state.name)) {
            show = true;
        } else if (this.state.inputNameFocus) {
            show = true;
        }
        this.setState({showNamePlaceholder: show})
    }

    togglePhonePlaceHolder() {
        let show = false;
        if (!isEmpty(this.state.currentPhoneValue)) {
            show = true;
        } else if (this.state.inputPhoneFocus) {
            show = true;
        }
        this.setState({showPhonePlaceholder: show})
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
    textInput: {
        color: '#000000',
        fontSize: 15,
        borderBottomWidth: 0,
        ...Platform.select({
            ios: {
                paddingTop: 0,
                paddingBottom: 7
            },
            android: {
                marginLeft: -5,
                paddingBottom: 0,
                paddingTop: 0
            },
        }),
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
