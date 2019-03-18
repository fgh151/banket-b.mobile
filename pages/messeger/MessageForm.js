import React, {Component} from "react";
import moment from "moment";
import {db} from '../../Config';
import {AsyncStorage, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

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
        }
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


        console.log(state, text.replace(/\s/g, '').length);

        this.setState(state)
    }

    render() {
        return (
            <View style={style.wrapper}>

                <View style={{width: '90%', padding: 10,}}>
                    <TextInput
                        style={style.textInput}
                        autoFocus={false}
                        placeholderTextColor="#C4C4C4"
                        placeholder="Сообщение..."
                        value={this.state.message}
                        onChangeText={(txt) => this.setText(txt)}
                        onFocus={() => this.props.onToggle()}
                        onBlur={() => this.props.onToggle()}
                    />
                </View>
                <View style={{width: '10%', paddingTop: 0, paddingRight: 10}}>
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
        )
    }
}

const style = StyleSheet.create({
    wrapper: {
        borderColor: '#D8D8D8',
        borderTopWidth: 1,
        marginTop: 10,
        flexDirection: 'row',
        // marginBottom:15,
        // marginLeft:15,
        // marginRight:15,
        backgroundColor: '#F7F7F7'
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
                paddingTop: 3,
                paddingBottom: 5
            },
            android: {
                marginLeft: -5
            },
        }),
    },

    buttonWrapperInactive: {
        marginTop: 10,
        width: 29,
        height: 29,
        borderRadius: 15,
        // backgroundColor: '#0C21E2'
        backgroundColor: '#555'
    },

    buttonWrapperActive: {
        marginTop: 10,
        width: 29,
        height: 29,
        borderRadius: 15,
        backgroundColor: '#0C21E2'
    },
    button: {
        color: '#ffffff',
        textAlign: 'center',

        ...Platform.select({
            ios: {
                fontSize: 20,
            },
            android: {
                marginTop: -9,
                fontSize: 30,
            },
        }),
    }

});