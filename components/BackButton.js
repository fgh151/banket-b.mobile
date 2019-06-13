import React, {Component} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Actions} from "react-native-router-flux";

export default class BackButton extends Component{

    constructor(props) {
        super(props);
    }

    image = require('../assets/images/back.png');

    backAction = () => this.props.backAction === undefined ? Actions.pop() : this.props.backAction();

    render() {
        if (this.props.image) {
            this.image = require('../assets/images/back-white.png');
        }
        return(
            <TouchableOpacity
                style={[styles.wrapper, this.props.style]}
                onPress={() => {
                    this.backAction();
                }}
            >
                <View style={{ alignItems: 'center', backgroundColor:'transparent', padding:16 }}>
                    <Image source={this.image} style={{height: 14, width: 22}} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                top: 0
            },
            android: {
                height: '100%',
            },
        }),
    },
});