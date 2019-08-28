import React from "react"
import {Image, StyleSheet, Text, View} from "react-native";
import {Styles as textStyle, windowPadding} from "../../styles/Global";
import log from "../../helpers/firebaseAnalytic";

export default function Empty() {

    log(this, 'dialog_list_render');
    return (
        <View style={textStyle.rootViewWrapper}>
            <View style={WIIstyles.sliderItem}>
                <Image source={require('../../assets/images/waiting_answers.png')}
                       style={{marginBottom: windowPadding, width: 130, height: 130}}/>
                <View style={WIIstyles.sliderTextWrapper}>
                    <Text style={[textStyle.defaultFont, {
                        textAlign: 'center',
                        fontSize: 15,
                        lineHeight: 20,
                        fontWeight: 'bold',
                        paddingBottom: 15
                    }]}>
                        Аукцион запущен!
                    </Text>
                    <Text style={[textStyle.defaultFont, {
                        textAlign: 'center',
                        opacity: .5,
                        fontSize: 15,
                        lineHeight: 20
                    }]}>
                        Ожидайте предложения от ресторанов, {"\n"}
                        чтобы выбрать лучшее.
                    </Text>
                </View>
            </View>
        </View>
    )
}

const WIIstyles = StyleSheet.create({
    sliderItem: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 90
    },
    sliderTextWrapper: {
        width: 300
    },
});
