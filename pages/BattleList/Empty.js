import React from 'react';
import {Text, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import {Button} from '../../components/Button';
import {Actions} from "react-native-router-flux";
import log from "../../helpers/firebaseAnalytic";

export default function Empty() {
    log(this, 'render_empty_battle_list');
    return (
        <View style={[textStyle.rootViewWrapper, {alignItems: 'center'}]}>
            <View style={[textStyle.rootView, {flex: 0.9, justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={[textStyle.defaultFont, {
                    textAlign: 'center',
                    marginBottom: 30,
                    fontSize: 15,
                    lineHeight: 20,
                    opacity: .5,
                    color: '#000000'
                }]}>У вас еще нет ни одного батла, создайте новый батл и получайте
                    предложения от ресторанов.</Text>
                <Button onPress={() => Actions.Form()} title={"Создать новый батл"}/>
            </View>
            {/*<View style={{flex: 0.3}}>*/}
            {/*<Ad/>*/}
            {/*</View>*/}
        </View>
    );
}