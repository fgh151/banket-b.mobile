import React from "react";
import {Text, View} from "react-native"
import Hyperlink from 'react-native-hyperlink'
import moment from "moment";

export default class Message extends React.PureComponent {


    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View>
                    <Hyperlink linkDefault={true}>
                        <Text>{this.props.message}</Text>
                    </Hyperlink>
                </View>
                <View style={{justifyContent: 'flex-end', paddingLeft: 10}}>
                    {this.renderTime(this.props.created_at, 'right')}
                </View>
            </View>
        )
    }

    renderTime(timestamp, align) {
        const time = moment(timestamp * 1000);
        return (
            <Text style={{paddingTop: 10, textAlign: align, color: '#878787', fontSize:12, lineHeight:15}}>{time.format('HH:mm')}</Text>
        )
    }

}