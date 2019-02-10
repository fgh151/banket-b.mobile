import React from "react";
import {Text} from "react-native";

export default class Profit extends React.PureComponent{


    render() {
        if (this.props.profit > 0) {
            return <Text style={styles.profit}>-{this.props.profit}%</Text>
        }
        return null;
    }

}