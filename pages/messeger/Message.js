import React from "react";
import {Text, View, StyleSheet} from "react-native"
import Hyperlink from 'react-native-hyperlink'
import moment from "moment";

export default class Message extends React.PureComponent {
    render() {
        const time = moment(this.props.created_at * 1000);
        return (
            <View style={style.wrapper}>
                <View style={style.messageWrapper}>
                    <Hyperlink linkDefault={true}>
                        <Text>{this.props.message}</Text>
                    </Hyperlink>
                </View>
                <View style={style.timeWrapper}>
                    <Text style={style.time}>{time.format('HH:mm')}</Text>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    wrapper: {
         flexDirection: 'row',
        alignItems:'flex-end',
        justifyContent: 'center',
        padding: 15
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