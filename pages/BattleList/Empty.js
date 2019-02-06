import React from 'react';
import {Text, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import {Button} from '../../components/Button';
import {Actions} from "react-native-router-flux";

export default class Empty extends React.Component {
    render() {
        return (
            <View style={textStyle.rootView}>
                <View style={{flex: 0.9, justifyContent: 'center', width: 300, alignItems: 'center'}}>
                    <Text style={[textStyle.defaultFont, {textAlign: 'center', marginBottom: 30}]}>У вас еще нет ни одного батла, создайте новый батл и получайте
                        предложения от ресторанов.</Text>
                    <Button onPress={() => Actions.Create()} title={"Создать новый батл"}/>
                </View>
                <View style={{flex: 0.1}}>
                    <Text>ad</Text>
                </View>
            </View>
        );
    }
}