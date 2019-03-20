import React from "react";
import {Platform, StyleSheet, TextInput, View, Text} from "react-native";
import {plural} from "../../helpers/StringHelper";

const PLACEHOLDER_TEXT = 'Количество гостей';

export default class GuestsCountInput extends React.Component{

    state = {
        amount_value: null,
        placeholder: PLACEHOLDER_TEXT
    };

    constructor(props) {
        super(props);
    }

    onChange(amount) {
        console.log(amount);
        this.props.onChange('guests_count', amount);

        let state = {amount_value: amount};
        if (amount !== '') {
            state.placeholder = '';
        } else {

            state.placeholder = PLACEHOLDER_TEXT;
        }

        this.setState(state)
    };

    render(){
        return(
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
            <TextInput
                refInput={ref => {
                    this.input = ref
                }}
                style={[styles.textInput, valid.valid]}
                placeholderTextColor={'#000000'}
                onChangeText={(value) => this.onChange(value)}
                value={this.state.amount_value}
                keyboardType="numeric"
                placeholder={this.state.placeholder}
                returnKeyType={'done'}
            />
            <Text style={[styles.postfix, {opacity:this.state.amount_value?1:0}]}> {plural(this.state.amount_value, 'гость', 'гостя', 'гостей')}</Text>
            </View>
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


    postfix: {
        color: '#0C21E2',
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
        ...Platform.select({
            ios: {
                paddingTop: 10,
                paddingBottom: 5
            },
            android: {
                marginTop:15,
                // marginLeft: -100
            },
        }),
    },

    textInput: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
        ...Platform.select({
            ios: {
                paddingTop: 10,
                paddingBottom: 5
            },
            android: {
                // marginLeft: -5
            },
        }),
    }

});