import React from 'react';
import {Text, View, Button} from "react-native";
import {Actions} from "react-native-router-flux";
import trackEvent from '../helpers/AppsFlyer';

import GeoLocation from '../helpers/GeoLocation';
import Push from "../helpers/Push";

export default class WhatIsIt extends React.Component{

    constructor() {
        super();
        trackEvent('registration', {
            test: "test"
        });

        // let l = new GeoLocation();



    }

    componentDidMount() {

        var p = new Push();
    }

    goNext() {
        Actions.HowItWork();
    }

    render() {
        return (
            <View>
                <Text>Что это такое</Text>
                <Button onPress={() => this.goNext()} title="next">далее</Button>
            </View>
        );
    }
}