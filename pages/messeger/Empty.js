import React from "react"
import {Image, StyleSheet, Text, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";

export default function Empty() {
    return (

        <View style={textStyle.rootViewWrapper}>
            <View style={WIIstyles.sliderItem}>
                <Image source={require('../../assets/images/clock.png')} style={{marginBottom: 15}}/>
                <View style={WIIstyles.sliderTextWrapper}>
                    <Text style={[textStyle.defaultFont, {
                        textAlign: 'center',
                        opacity: .5,
                        fontSize: 15,
                        lineHeight: 20
                    }]}>
                        Ожидаем предложений {"\n"}
                        от ресторанов…
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
    },
    sliderTextWrapper: {
        width: 300
    },
});
