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


        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10
    }
});

// Shadow.prototype = {
//     style:stylePropType
// };