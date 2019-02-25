import React from 'react';
import {StyleSheet, Text, View} from "react-native"

import {isString} from "../helpers/StringHelper";

export default class Input extends React.Component {

    state = {
        focus: false,
        placeholder: '',
        component: this.props.component
    };

    component;

    onInputFocus() {
        const component = React.cloneElement(
            this.state.component,
            {placeholder: ''}
        );
        let newState = {focus:!this.state.focus, component: component};

        this.setState(newState)
    }

    onInputFocusOut() {
        const component = React.cloneElement(
            this.state.component,
            {placeholder: this.state.placeholder}
        );
        let newState = {focus:!this.state.focus, component: component};

        this.setState(newState)
    }

    constructor(props) {
        super(props);
        this.component = React.cloneElement(
            this.props.component,
            {onFocus: () => this.onInputFocus(), onBlur:  () => this.onInputFocusOut()}
        );
    }

    componentDidMount(): void {
        let newState = {component: this.component, placeholder: ''};
        const placeholder = this.component.props.placeholder;
        if (isString(placeholder)) {
            newState.placeholder =  this.component.props.placeholder;
        }
        this.setState(newState);
    }

    render() {

        return (
            <View style={[styles.wrapper, this.props.style]}>
                {this.renderPlaceholder(this.state.placeholder)}
                {this.renderError()}
                <View style={[styles.input, this.props.inputStyle]}>
                    {this.state.component}
                </View>
                <Text style={styles.description}>{this.props.description}</Text>
                {this.renderOverlay()}
            </View>
        )
    }

    renderPlaceholder(text: string) {
        if (isString(text) && this.state.focus) {
            return <Text>{text}</Text>
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

Input.propTypes = {
    // component: PropTypes.element,
    // description: PropTypes.string,
    // valid: PropTypes.bool,
    // active: PropTypes.bool,
    // style:PropTypes.any,
    // inputStyle:PropTypes.any
};

Input.defaultProps = {
    description: '',
    valid: false,
    active: true,
    style: {},
    inputStyle: {}
};

const styles = StyleSheet.create({
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
        paddingBottom: 5
    },
    description: {
        color: '#E0E0E0',

        fontFamily: "Lato-Regular",
    },
    error: {
        color: '#ff1700'
    }
});