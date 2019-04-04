import React from "react";
import {StyleSheet, Text} from "react-native";

/**
 * @return {null}
 */
export default function Profit(props) {
    if (props.profit > 0) {
        return <Text style={styles.profit}>{props.profit}%&nbsp;выгода</Text>
        }
        return null;
}

const styles = StyleSheet.create({
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
});