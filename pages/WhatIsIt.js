import React from 'react';
import {Text, View} from "react-native";
import {Actions} from "react-native-router-flux";
import trackEvent from '../helpers/AppsFlyer';

import GeoLocation from '../helpers/GeoLocation';
import Push from "../helpers/Push";

import {text as textStyle} from '../styles/Global';
import {Button} from '../components/Button';
import Shadow from '../components/Shadow';

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
                <Text style={textStyle.bold}>Что это такое</Text>
                <Text style={textStyle.default}>Мучительный</Text>

                <Shadow>

                <Button onPress={() => this.goNext()} title="next">Создать новый батл</Button>
                </Shadow>
            </View>
        );
    }
}