import React, {Component} from "react";
import moment from "moment";
import {db} from '../../Config';
import {
    Animated,
    AsyncStorage,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {ifIphoneX} from "react-native-iphone-x-helper";
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import {CHAT_ANSWER, funnel} from "../../components/Funnel";

export default class MessageForm extends Component {

    constructor(props) {
        super(props);

        this.proposalId = this.props.proposalId;
        this.organizationId = this.props.organizationId;

        this.state = {
            author_class: "app\\common\\models\\MobileUser",
            organization_id: this.props.organizationId,
            proposal_id: this.props.proposalId,
            created_at: moment().format('X').toString(),
            message: "",

            btnDisabled: true,
            btnStyle: style.buttonWrapperInactive
        };

        this.paddingInput = new Animated.Value(0);
    }

    sendMessage() {
        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.proposalId + '/o_' + this.organizationId + '/' + this.state.created_at;
                db.ref(path).set({
                    author_class: this.state.author_class,
                    organization_id: this.state.organizationId,
                    proposal_id: this.state.proposal_id,
                    created_at: this.state.created_at,
                    message: this.state.message,
                });
                this.setState({
                    message: "",
                    btnDisabled: true,
                    btnStyle: style.buttonWrapperInactive,
                    created_at: moment().format('X'),
                })
            });

        funnel.catchEvent(CHAT_ANSWER, {proposal: this.proposalId, organization: this.organizationId});
    }

    setText(text) {
        let state = {message: text};

        if (text.replace(/\s/g, '').length) {

            state.btnDisabled = false;
            state.btnStyle = style.buttonWrapperActive
        } else {

            state.btnDisabled = true;
            state.btnStyle = style.buttonWrapperInactive
        }
        this.setState(state)
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 60,
        }).start();
    };

    keyboardWillHide = (event) => {
        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 0,
        }).start();
    };

    render() {
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Animated.View style={{marginBottom: this.paddingInput}}>
                    <View style={style.wrapper}>

                        <View style={{width: '88%', padding: 10}}>
                            <TextInput
                                style={style.textInput}
                                autoFocus={false}
                                placeholderTextColor="#C4C4C4"
                                placeholder="Сообщение..."
                                value={this.state.message}
                                onChangeText={(txt) => this.setText(txt)}
                                onFocus={() => this.props.onToggle()}
                                onBlur={() => this.props.onToggle()}
                                underlineColorAndroid='transparent'
                                autoCorrect={false}
                            />
                        </View>
                        <View style={style.buttonWrapper}>
                            <TouchableOpacity
                                disabled={this.state.btnDisabled}
                                transparent
                                style={this.state.btnStyle}
                                onPress={() => this.sendMessage()}
                            >
                                <Text style={style.button}>{"\u2191"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        )
    }
}

const style = StyleSheet.create({
    wrapper: {
        borderColor: '#D8D8D8',
        borderTopWidth: 1,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        ...ifIphoneX({
            marginBottom: -35,
            paddingBottom:35
        }),
        ...Platform.select({
            ios: {
                height: 60
            },
            android: {
                marginLeft: -4,
                marginRight: -8
            },
        }),
    },

    textInput: {
        backgroundColor: '#ffffff',
        borderRadius: 30,
        padding: 10,
        color: '#000',
        borderWidth: 1,
        // textDecoration:'none',

        fontSize: 15,
        lineHeight: 18,

        borderColor: '#D8D8D8',
        ...Platform.select({
            ios: {
                paddingTop: 2,
                paddingBottom: 2,

                height: 35
            },
            android: {
                marginLeft: -5,
                padding:5,
                paddingLeft: 12
            },
        }),
    },
    buttonWrapper: {
        width: '10%',
        paddingTop: 0,
        paddingRight: 10,
        ...Platform.select({
            ios: {
                height: 35,
                marginTop: 10,
                paddingTop: 0,

            },
            android: {
               paddingTop:5
            },
        }),
    },

    buttonWrapperInactive: {
        backgroundColor: '#ccc',
        ...Platform.select({
            ios: {
                borderRadius: 17,
                height: 35,
                width: 35,
                marginTop: 0,
                marginRight: 5,

                // backgroundColor:'red'
            },
            android: {
                borderRadius: 15,
                width: 29,
                height: 29,
                marginTop: 10,
            },
        }),
    },

    buttonWrapperActive: {
        marginTop: 10,
        width: 29,
        height: 29,
        borderRadius: 15,
        backgroundColor: '#0C21E2',
        ...Platform.select({
            ios: {
                borderRadius: 17,
                height: 35,
                width: 35,
                marginTop: 0,
                marginRight: 5,
            },
            android: {
                borderRadius: 15,
                width: 29,
                height: 29,
                marginTop: 10,
            },
        }),

    },
    button: {
        color: '#ffffff',
        textAlign: 'center',

        ...Platform.select({
            ios: {
                fontSize: 20,
                marginTop: 5,
            },
            android: {
                marginTop: -9,
                fontSize: 30,
            },
        }),
    }

});