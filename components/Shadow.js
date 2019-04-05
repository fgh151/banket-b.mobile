import React from 'react';
import {StyleSheet, View} from "react-native";
import AndroidVersion from "../helpers/AndroidVersion";

export default function Shadow(props) {
    return <View
        style={[styles.shadow, props.style]}
        ref={c => (this._root = c)} {...props}
    />;
}

const styles = StyleSheet.create({
    shadow: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 1,
        backgroundColor: 'white',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 7,
        ...AndroidVersion.select({
            '>=26': {
                elevation: 1,
                borderWidth:0
            }
        })

    }
});
