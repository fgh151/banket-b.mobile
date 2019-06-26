import React, {Component} from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native"
import AS from '@react-native-community/async-storage'
import {Button} from "../../components/Button";
import {Styles as textStyle} from "../../styles/Global";
import {Actions} from "react-native-router-flux";
import Client from '../../http/Client'

export default class Feedback extends Component {

    constructor() {
        super();
        this.state = {
            content: '',
            btnDisabled: true,
        };
    }

    componentDidMount() {
        if (!__DEV__) {
            this.input.focus();
        }
    }

    nextPage = () => {
        console.log('next');
        this.setState({btnDisabled: true});
        AS.getItem('battle@token')
            .then((result) => {
                if (result === null) {
                    Actions.RegisterPhone();
                } else {
                    const api = new Client(result);
                    api.POST('/v2/feedback/add', this.state)
                        .then(response => {
                            Actions.FeedbackDone();

                        });
                }
            })
            .catch((e) => this.setState({btnDisabled: false}));
    };

    setText(text) {
        let state = {content: text};
        state.btnDisabled = !text.replace(/\s/g, '').length;
        this.setState(state)
    }

    render() {
        return (
            <View style={[textStyle.rootViewWrapper, styles.wrapper]}>

                <View style={{width: '100%', flex: 1}}>
                    <TextInput
                        multiline
                        ref={(input) => {
                            this.input = input;
                        }}
                        style={[styles.textInput, {
                            paddingBottom: 5,
                            fontSize: 15,
                            lineHeight: 18,
                            fontFamily: "Lato-Regular",
                            width: '100%',
                            height: '90%',

                            textAlignVertical: 'top'
                        }]}
                        placeholderTextColor={'#000000'}
                        onChangeText={(feedback) => {
                            this.setText(feedback)
                        }}
                        placeholder='Ваш комментарий'
                        returnKeyType={'done'}
                        blurOnSubmit={true}
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View style={{width: '100%'}}>
                    <Button
                        title="Продолжить"
                        disabled={this.state.btnDisabled}
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'space-between'
    },
    textInput: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
        ...Platform.select({
            ios: {
                paddingTop: 10,
                paddingBottom: 5
            },
            android: {
                marginLeft: -5
            },
        }),
    }
});