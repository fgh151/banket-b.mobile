import React from 'react';
import {Text, TouchableOpacity, View,Image} from "react-native";


export default class ReSendCode extends React.Component{

    render() {
        return(
            <View>
                <TouchableOpacity onPress={this.props.onPress}>
                    <Image source={require('../../assets/images/refresh.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}