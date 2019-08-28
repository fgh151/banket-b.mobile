import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import {Button} from "../../components/Button";
import {Actions} from "react-native-router-flux";
import log from "../../helpers/firebaseAnalytic";

export default class FeedbackDone extends Component {
    render() {
        log(this, 'render');
        return (
            <View style={[textStyle.rootViewWrapper]}>
                <View style={WIIstyles.sliderItem}>
                    <Image source={require('../../assets/images/feedback-done.png')}
                           style={{marginBottom: 30, width: 120, height: 120}}/>
                    <View>
                        <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Ваш отзыв{"\n"} отправлен</Text>
                    </View>
                </View>
                <View style={WIIstyles.createButtonWrapper}>
                    <Button
                        onPress={() => {
                            Actions.BattleList();
                            log(this, 'next_btn');
                        }}
                        title="Перейти к батлам"
                    />
                </View>
            </View>
        )
    }
}

const WIIstyles = StyleSheet.create({
    sliderItem: {
        flex: 90,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 140
    },
    sliderHeader: {
        fontSize: 28,

        lineHeight: 34,
        fontWeight: 'bold',

        color: '#000000'
    },
    createButtonWrapper: {
        flex: 10,
        width: '100%'
    }
});