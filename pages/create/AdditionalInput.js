import React from "react";
import {Platform, StyleSheet, TextInput} from "react-native";

export default class AdditionalInput extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {height: 49};
    }



    render() {
        return (
            <TextInput
                multiline
                ref={ref => {
                    this.AdditionalInput = ref
                }}
                style={[styles.textInput, valid.valid, {
                    paddingBottom: 5,
                    borderBottomColor: '#E0E0E0',
                    borderBottomWidth: 1,
                    fontSize: 15,
                    lineHeight: 18,
                    fontFamily: "Lato-Regular",
                    marginRight: 10,
                    textAlignVertical: 'top',
                    height: this.state.height,
                }]}

                onContentSizeChange={(event) => {
                    console.log('new height', event.nativeEvent.contentSize.height);
                    this.setState({height: event.nativeEvent.contentSize.height})
                }}

                placeholderTextColor={'#000000'}
                onChangeText={(notes) => {
                    this.props.onChangeText(notes)
                }}
                placeholder='Ваш комментарий'
                returnKeyType={'done'}
                blurOnSubmit={true}
                value={this.props.value}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur}
            />
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
                marginLeft: -5
            },
        }),
    }
});