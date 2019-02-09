import React, {Component} from 'react';
import {Image, TouchableOpacity, View} from 'react-native'
import {Actions} from "react-native-router-flux";

export default class BackButton extends Component{

    render() {
        return(
            <TouchableOpacity
                // style={{position: 'absolute', top: 5, backgroundColor:'green'}}
                onPress={() => {
                    Actions.pop();
                }}
            >
                <View style={{ alignItems: 'center', backgroundColor:'transparent', padding:16 }}>
                    <Image source={require('../assets/images/back.png')} style={{height: 14, width: 22}} />
                </View>
            </TouchableOpacity>
        );
    }
}
