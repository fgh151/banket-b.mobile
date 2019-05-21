import React from 'react';
import {
    Button as BaseButton,
    Platform,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";

export class Button extends BaseButton{

    state = {
        disabled: false
    };

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(props) {
        const {disabled} = this.props;
        this.setState({disabled: disabled});
    }

    render() {
        let {
            accessibilityLabel,
            color,
            onPress,
            title,
            hasTVPreferredFocus,
            testID,
        } = this.props;

        const buttonStyles = [styles.button];
        const textStyles = [styles.text];
        if (color) {
            if (Platform.OS === 'ios') {
                textStyles.push({color: color});
            } else {
                buttonStyles.push({backgroundColor: color});
            }
        }
        const accessibilityStates = [];
        if (this.state.disabled) {
            buttonStyles.push(styles.buttonDisabled);
            textStyles.push(styles.textDisabled);
            accessibilityStates.push('disabled');
        }

        const formattedTitle =
            Platform.OS === 'android' ? title.toUpperCase() : title;
        const Touchable =
            Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
        return (
            <Touchable
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                accessibilityStates={accessibilityStates}
                hasTVPreferredFocus={hasTVPreferredFocus}
                testID={testID}
                disabled={this.state.disabled}
                onPress={onPress}>
                <View style={buttonStyles}>
                    <Text style={textStyles} disabled={this.state.disabled}>
                        {formattedTitle}
                    </Text>
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    button: Platform.select({
        ios: {
            backgroundColor: '#0C20E3',
            borderRadius:5
        },
        android: {
            elevation: 0,
            // Material design blue from https://material.google.com/style/color.html#color-color-palette
            backgroundColor: '#0C20E3',
            borderRadius:5
        },
    }),
    text: Platform.select({
        ios: {
            // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
            color: 'white',
            textAlign: 'center',
            padding: 8,
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: "Lato-Bold",
        },
        android: {
            color: 'white',
            textAlign: 'center',
            padding: 8,
            fontWeight: '500',
            fontFamily: "Lato-Bold",
        },
    }),
    buttonDisabled: Platform.select({
        ios: {
            elevation: 0,
            backgroundColor: 'transparent',
            borderColor: '#CFCFCF',
            borderWidth:1,
            color: '#CFCFCF',
        },
        android: {
            elevation: 0,
            backgroundColor: 'transparent',
            borderColor: '#CFCFCF',
            borderWidth:1,
            color: '#CFCFCF'
        },
    }),
    textDisabled: Platform.select({
        ios: {
            color: '#cdcdcd',
        },
        android: {
            color: '#a1a1a1',
        },
    }),
});