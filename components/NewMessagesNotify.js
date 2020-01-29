import React from "react";
import {StyleSheet, View} from "react-native";

export default function NewMessagesNotify(props) {
    if (props.newMessages) {
        return (
            <View style={styles.round}/>
        )
    }
}

const styles = StyleSheet.create({
    round: {
        height: 22,
        width: 22,
        backgroundColor: '#D0021B',
        borderRadius: 11,
        borderWidth: 5,
        borderColor: '#ec9aa4',
        position: 'absolute',
        top: -11,
        right: -11
    }
});
