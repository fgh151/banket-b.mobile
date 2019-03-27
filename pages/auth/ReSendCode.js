import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from "react-native";


export default class ReSendCode extends React.Component {

    render() {
        return (
            <View style={style.wrapper}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <Image source={require('../../assets/images/reload.png')} style={{width: 18, height: 18}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const style = StyleSheet.create({
    wrapper: {
        padding: 15,
        marginLeft: -30,
        ...Platform.select({
            ios: {
            },
            android: {

                position: 'absolute',
                right: -10,
                top: -12,

                // backgroundColor:'red'
            },
        })
    }
});