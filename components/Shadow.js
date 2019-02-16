import React from 'react';
import {StyleSheet, View} from "react-native";


export default class Shadow extends React.Component {
    render() {
        return <View
            style={[styles.shadow, this.props.style]}
            ref={c => (this._root = c)} {...this.props}
        />;
    }
}


const styles = StyleSheet.create({
    shadow: {


        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 250,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 1,

        backgroundColor: 'white'
    }
});

// Shadow.prototype = {
//     style:stylePropType
// };