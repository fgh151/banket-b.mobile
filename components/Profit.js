import React from "react";
import {StyleSheet, Text} from "react-native";

export default class Profit extends React.PureComponent{


    render() {

        console.log(this.props.profit);

        if (this.props.profit > 0) {
            return <Text style={styles.profit}>-{this.props.profit}%&nbsp;выгода</Text>
        }
        return null;
    }

}

const styles = StyleSheet.create({
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
});