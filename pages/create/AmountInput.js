import React from "react";
import {Platform, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {plural} from "../../helpers/StringHelper";

export const PLACEHOLDER_TEXT = 'Стоимость на гостя';

export default class AmountInput extends React.Component {

    state = {
        amount_value: null,
        placeholder: PLACEHOLDER_TEXT
    };

    constructor(props) {
        super(props);
    }

    onChange(amount) {
        console.log(amount);
        this.props.onChange('amount', amount);
        let state = {amount_value: amount};
        if (amount !== '') {
            state.placeholder = '';
        } else {

            state.placeholder = PLACEHOLDER_TEXT;
        }

        this.setState(state)
    };

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.refs.Input.focus()}
                style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-start', width: '100%'}}
            >
                <TextInput
                    refInput={ref => {
                        this.input = ref
                    }}
                    ref='Input'
                    style={[styles.textInput, valid.valid]}
                    placeholderTextColor={'#000000'}
                    onChangeText={(value) => this.onChange(value)}
                    value={this.state.amount_value}
                    keyboardType="numeric"
                    placeholder={this.state.placeholder}
                    returnKeyType={'done'}
                    autoCorrect={false}
                />
                <Text
                    style={[styles.postfix, {opacity: this.state.amount_value ? 1 : 0}]}> {plural(this.state.amount_value, 'рубль', 'рубля', 'рублей')} на
                    гостя</Text>
            </TouchableOpacity>
        )
    }
}

const valid = StyleSheet.create({
    valid: {
        color: '#0C21E2'
    },
    invalid: {
        color: '#000000'
    }
});

const styles = StyleSheet.create({
    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    postfix: {
        color: '#0C21E2',
        fontSize: 15,
        lineHeight: 18,

        alignSelf: 'center',

        fontFamily: "Lato-Regular",
        ...Platform.select({
            ios: {
            },
            android: {
                marginTop: 15,
            },
        }),
    },

    textInput: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
        ...Platform.select({
            ios: {
            },
            android: {
                marginLeft: -5,
                paddingBottom: 0,
            },
        }),
    }
});