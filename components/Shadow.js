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


        // padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        marginTop: 10,
        marginBottom: 1,

        backgroundColor: 'white',

        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,



        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 7,

    }
});

// Shadow.prototype = {
//     style:stylePropType
// };