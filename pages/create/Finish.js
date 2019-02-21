import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import {Button} from "../../components/Button";
import {Actions} from "react-native-router-flux";

export default class Finish extends React.Component {

    render() {
        return (
            <View style={textStyle.rootViewWrapper}>
                <View style={WIIstyles.sliderItem}>
                    <Image source={require('../../assets/images/done.png')}/>
                    <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Ваш батл создан!</Text>
                    <View style={WIIstyles.sliderTextWrapper}>
                        <Text style={[textStyle.defaultFont, {textAlign: 'center'}]}>
                            Батл успешно создан и отправлен в рестораны. Ожидайте ответов от ресторанов.
                        </Text>
                    </View>
                </View>
                <View style={WIIstyles.createButtonWrapper}>
                    <Button onPress={() => Actions.BattleList()} title="Перейти к батлам"/>
                </View>
            </View>
        )
    }
}


const WIIstyles = StyleSheet.create({
    sliderDot: {
        backgroundColor: 'transparent',
        borderColor: '#0C21E2',
        borderWidth: 1,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4
    },
    sliderItem: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderHeader: {
        fontSize: 34,
        color: '#000000'
    },
    sliderTextWrapper: {
        width: 300
    },
    sliderText: {
        fontSize: 20,
        color: '#000000'
    },
    createButtonWrapper: {}
});