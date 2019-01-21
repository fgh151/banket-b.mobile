import React, {Component} from "react";
import {ActivityIndicator, View} from "react-native";

export default class Loading extends Component {
    render() {
        return (
            <View>
                <ActivityIndicator color={'#fff'} style={{alignItems: 'center', marginTop: 80}}
                                   size={'large'}/>
            </View>
        );
    }
}
