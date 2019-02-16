import React from 'react';
import {Text, View, StyleSheet} from "react-native"
import PropTypes from 'prop-types';

export default class Input extends React.Component {
    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                {this.renderError()}
                <View style={[styles.input, this.props.inputStyle]}>
                    {this.props.component}
                </View>
                <Text style={styles.description}>{this.props.description}</Text>
                {this.renderOverlay()}
            </View>
        )
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
    component: PropTypes.element,
    description: PropTypes.string,
    valid: PropTypes.bool,
    active: PropTypes.bool,
    style:PropTypes.stylists,
    inputStyle:PropTypes.stylists
};

Input.defaultProps = {
    description: '',
    valid: false,
    active: true
};

const styles = StyleSheet.create({
    overlay : {
        opacity: .3,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        top:0,
        left:0,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        position: "relative"
    },
    input : {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    description: {
        color: '#E0E0E0'
    },
    error : {
        color: '#ff1700'
    }
});