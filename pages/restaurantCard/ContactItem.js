import React from "react"
import {windowPadding} from "../../styles/Global";
import {View} from "react-native";

export default function ContactItem(props) {
    return (
        <View style={{
            flexDirection: 'row', padding: windowPadding,
            borderBottomColor: '#e0e0e0',
            borderBottomWidth: 1
        }}
              {...props}
        />
    );
}
