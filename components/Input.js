import React from 'react';
import {StyleSheet, Text, View, Platform} from "react-native"

import {isString} from "../helpers/StringHelper";

export default class Input extends React.Component {

    state = {
        focus: false,
        placeholder: '',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                {this.renderPlaceholder(this.props.placeholder)}
                {this.renderError()}
                <View style={[styles.input, this.props.inputStyle]}>
                    {this.props.children}
                </View>
                <Text style={styles.description}>{this.props.description}</Text>
                {this.renderOverlay()}
            </View>
        )
    }

    renderPlaceholder(text: string) {
        if ((isString(text) && this.state.focus) || this.props.showPlaceholder) {
            return <Text style={styles.activePlaceholder}>{text}</Text>
        }
    }

    renderOverlay() {
        if (this.props.active) {
            return null;
        } else {
            return (
                <View style={styles.overlay}/>
            )
        }
    }

    renderError() {
        if (this.props.error) {
            return <Text style={styles.error}>{this.props.error}</Text>
        }
        return null;
    }

}

Input.defaultProps = {
    style: {},
    placeholder:'',
    inputStyle: {},
    description: '',
    showPlaceholder:false,
    active: true,
    error:undefined,
};

const styles = StyleSheet.create({
    activePlaceholder :{

        color:'#000000',
        opacity:.5,
        fontSize: 11,
        lineHeight: 13,

        ...Platform.select({
            ios: {
            },
            android: {
                // marginLeft: -5
            },
        })
    },
    overlay: {
        opacity: .3,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        top: 0,
        left: 0,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        position: "relative"
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',

        ...Platform.select({
            ios: {
                paddingBottom: 0,
                marginBottom: 10,
            },
            android: {
                paddingBottom: 0,
                marginBottom: 10,
            },
        })

    },
    description: {
        color:'#000000',
        opacity:.5,

        fontSize: 13,
        lineHeight: 16,
        fontFamily: "Lato-Regular",

        ...Platform.select({
            ios: {
            },
            android: {
                marginLeft: -5
            },
        })
    },
    error: {
        color: '#ff1700'
    }
});