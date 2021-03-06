import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native"
import PropTypes from "prop-types";

export default class ServiceInput extends React.Component {

    state = {
        wrapperStyle: style.inactiveWrapper,
        textStyle: style.inactiveText,
        active: false
    };

    pressHandler = () => {
        this.toggleStyle();
        this.props.onPress();
    };

    toggleStyle = () => {
        if (this.state.active) {
            this.setState({
                wrapperStyle: style.inactiveWrapper,
                textStyle: style.inactiveText,
                active: false
            });
        } else {
            this.setState({
                wrapperStyle: style.activeWrapper,
                textStyle: style.activeText,
                active: true
            });
        }
    };

    render() {
        return (
            <TouchableOpacity
                onPress={this.pressHandler}
                style={this.state.wrapperStyle}
            >
                <Text style={this.state.textStyle}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    inactiveWrapper: {
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 11,
        paddingBottom: 11,
        margin: 5,
        marginBottom: 6,
        borderRadius: 20,
        backgroundColor: '#E7E7E7',
    },
    inactiveText: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
    },
    activeWrapper: {
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 11,
        paddingBottom: 11,
        margin: 5,
        marginBottom: 6,
        borderRadius: 20,
        backgroundColor: '#0C21E2',
        alignSelf: 'flex-start',
        fontSize: 17,
        lineHeight: 20
    },
    activeText: {
        color: '#ffffff',
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
    }
});

ServiceInput.propTypes = {
    onPress: PropTypes.func
};