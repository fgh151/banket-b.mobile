import React from 'react';
import {Button as BaseButton} from "react-native";
import {StyleSheet, TouchableNativeFeedback, TouchableOpacity, Text, View, Platform} from "react-native";

export class Button extends BaseButton{



    render() {
        const {
            accessibilityLabel,
            color,
            onPress,
            title,
            hasTVPreferredFocus,
            disabled,
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
        if (disabled) {
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
                disabled={disabled}
                onPress={onPress}>
                <View style={buttonStyles}>
                    <Text style={textStyles} disabled={disabled}>
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
            color: '#0C20E3',
            textAlign: 'center',
            padding: 8,
            fontSize: 18,
        },
        android: {
            color: 'white',
            textAlign: 'center',
            padding: 8,
            fontWeight: '500',
        },
    }),
    buttonDisabled: Platform.select({
        ios: {},
        android: {
            elevation: 0,
            backgroundColor: '#dfdfdf',
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