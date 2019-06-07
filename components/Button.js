import React from 'react';
import {Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";

const invariant = require('fbjs/lib/invariant');


/**
 * A basic button component that should render nicely on any platform. Supports
 * a minimal level of customization.
 *
 * <center><img src="img/buttonExample.png"></img></center>
 *
 * If this button doesn't look right for your app, you can build your own
 * button using [TouchableOpacity](docs/touchableopacity.html)
 * or [TouchableNativeFeedback](docs/touchablenativefeedback.html).
 * For inspiration, look at the [source code for this button component](https://github.com/facebook/react-native/blob/master/Libraries/Components/Button.js).
 * Or, take a look at the [wide variety of button components built by the community](https://js.coach/react-native?search=button).
 *
 * Example usage:
 *
 * ```
 * import { Button } from 'react-native';
 * ...
 *
 * <Button
 *   onPress={onPressLearnMore}
 *   title="Learn More"
 *   color="#841584"
 *   accessibilityLabel="Learn more about this purple button"
 * />
 * ```
 *
 */

export class Button extends React.Component<{
    title: string,
    onPress: () => any,
    color?: ?string,
    hasTVPreferredFocus?: ?boolean,
    accessibilityLabel?: ?string,
    disabled?: ?boolean,
    testID?: ?string,
}> {

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
        invariant(
            typeof title === 'string',
            'The title prop of a Button must be a string',
        );
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
