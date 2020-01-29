import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {windowPadding} from "../../styles/Global";


export default function ReSendCode(props) {

    return (
        <View style={style.wrapper}>
            <TouchableOpacity onPress={props.onPress}>
                <Image source={require('../../assets/images/reload.png')} style={{width: 18, height: 18}}/>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    wrapper: {
        padding: windowPadding,
        marginLeft: -(windowPadding * 2),
        ...Platform.select({
            ios: {

                position: 'absolute',
                right: -12,
                top: -windowPadding,
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
