import React from "react";
import {Share, StyleSheet, TouchableOpacity, View} from "react-native";
import Message from "./Message";

export default class MessageWrapper extends React.PureComponent {

    static defaultProps() {
        return {
            bubbleColor: '#DFEAFF',
            align: 'flex-end',
            share: false,
            same: false,
            model: {
                message: '',
                created_at: ''
            }
        }
    }

    sharePress() {
        if (this.props.share === true) {
            Share.share({
                message: this.props.model.message,
                title: 'Поделиться с другом'
            }, {
                // Android only:
                dialogTitle: 'Поделиться с другом',
                // iOS only:
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ]
            })
        }
    }

    render() {
        return (
            <View style={[style.root, {alignItems: this.props.align, marginTop: this.props.same === true ? 0 : 10}]}>
                <TouchableOpacity
                    onPress={() => this.sharePress()}
                    style={[style.wrapper, {backgroundColor: this.props.bubbleColor}]}
                >
                    <Message message={this.props.model.message} created_at={this.props.model.created_at}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const style = StyleSheet.create({
    root: {
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 15,
        flex: 1,
        flexDirection: 'row',
        maxWidth: '90%',
    }
});