import React from "react";
import {ActivityIndicator, View} from "react-native";
import {Styles as textStyle} from "../styles/Global";

export default function Loading() {
    return (
        <View style={[textStyle.rootViewWrapper, {flexDirection: 'column', justifyContent: 'center',}]}>
            <ActivityIndicator color={'#0C21E2'} size={'large'}/>
        </View>
    );
}