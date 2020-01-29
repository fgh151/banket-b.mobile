import React from 'react';
import {Styles, windowPadding} from "../../styles/Global";
import {StyleSheet, Text, View} from "react-native";

export default function CardItem(props) {
    return (
        <View style={style.wrapper}>
            <View style={style.titleWrapper}>
                <Text style={[Styles.boldFont, style.titleText]}>
                    {props.title}
                </Text>
            </View>
            <View style={style.contentWrapper}>
                {props.content}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    wrapper: {
        padding: windowPadding,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    titleWrapper: {
        marginBottom: 5
    },
    titleText: {
        fontSize: 15,
        lineHeight: 18,
        marginBottom: 5
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    }
});
