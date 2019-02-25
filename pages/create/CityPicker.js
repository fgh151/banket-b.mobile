import React from "react";
import {Text, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from "../../styles/Global";
import {City} from "../../helpers/GeoLocation";


export default class CityPicker extends React.Component {


    render() {
        return (
            <TouchableOpacity
                style={{paddingTop: 10}}
                onPress={() => Actions.CitySelector()}
            >
                <Text style={[textStyle.defaultFont, {
                    paddingBottom: 5,
                    fontSize: 15,
                    color: '#0C21E2'
                }]}>{(new City()).city.title}</Text>
            </TouchableOpacity>
        )
    }

}