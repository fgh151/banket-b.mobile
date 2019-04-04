import React from "react";
import {StyleSheet, View} from "react-native";

export default class NewMessagesNotify extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.newMessages) {
            return (
                <View style={styles.round}/>
            )
        }
        return null;
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