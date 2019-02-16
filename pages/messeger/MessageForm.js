import React, {Component} from "react";
import moment from "moment";
import {db} from '../../Config';
import {AsyncStorage, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";

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
            message: ""
        }
    }

    static getSendIconName() {
        switch (Platform.OS) {
            case 'ios': {
                return 'ios-send';
            }
        }
        return 'md-send';
    }

    sendMessage() {
        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.proposalId + '/o_' + this.organizationId + '/' + this.state.created_at;
                db.ref(path).set(this.state);
                this.setState({
                    message: "",
                    created_at: moment().format('X'),
                })
            });
    }

    render() {
        return (
            <View style={style.wrapper}>

                <View style={{width: '90%', padding: 10,}}>
                    <TextInput
                        style={style.textInput}
                        autoFocus={!__DEV__}
                        placeholderTextColor="#C4C4C4"
                        placeholder="Новое сообщение"
                        value={this.state.message}
                        onChangeText={(txt) => this.setState({message: txt})}
                    />
                </View>
                <View style={{width: '10%', paddingTop: 10, paddingRight: 10}}>
                    <TouchableHighlight transparent
                                        style={style.buttonWrapper}
                                        onPress={() => this.sendMessage()}>
                        <Text style={style.button}>{"\u2191"}</Text>
                    </TouchableHighlight>
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
        marginBottom: -15,
        marginLeft: -15,
        marginRight: -15,
        backgroundColor: '#F7F7F7'
    },

    textInput : {
        backgroundColor: '#ffffff',
        borderRadius: 30,
        padding: 10,
        color: '#C4C4C4',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        ...Platform.select({
            ios: {
                paddingTop:10,
                paddingBottom:5
            },
            android: {
                marginLeft: -5
            },
        }),
    },

    buttonWrapper: {
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