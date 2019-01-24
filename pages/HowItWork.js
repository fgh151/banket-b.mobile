import React from 'react';
import {Text, View, Button} from "react-native";
import {Actions} from "react-native-router-flux";
import {firstLunchDone} from '../helpers/Luncher';
import Push from '../helpers/Push';

export default class HowItWork extends React.Component{

    goNext() {
        // noinspection JSIgnoredPromiseFromCall
        // firstLunchDone();


        Actions.Login();
    }

    render() {
        return (
            <View>
                <Text>как это работает</Text>
                <Button onPress={() => this.goNext()} title="next">далее</Button>
            </View>
        );
    }
}