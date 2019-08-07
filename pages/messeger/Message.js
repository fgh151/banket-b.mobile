import React from "react";
import {StyleSheet, Text, View} from "react-native"
import HyperlinkedText from 'react-native-hyperlinked-text'
import moment from "moment";
import {windowPadding} from "../../styles/Global";

export default function Message(props) {
    const time = moment(props.created_at * 1000);
    return (
        <View style={style.wrapper}>
            <View style={style.messageWrapper}>
                <HyperlinkedText linkDefault={true}>
                    <Text>{props.message}</Text>
                </HyperlinkedText>
            </View>
            <View style={style.timeWrapper}>
                <Text style={style.time}>{time.format('HH:mm')}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    wrapper: {
         flexDirection: 'row',
        alignItems:'flex-end',
        justifyContent: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: windowPadding,
        paddingRight: windowPadding
    },
    messageWrapper: {
        maxWidth:'90%'
    },
    timeWrapper: {
        justifyContent: 'flex-end',
        paddingLeft: 10
    },
    time: {
        textAlign: 'right',
        color: '#878787',
        fontSize:12,
        lineHeight:15,
    }
});