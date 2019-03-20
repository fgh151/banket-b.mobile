import React from "react";
import {Text, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from "../../styles/Global";
import {City} from "../../helpers/GeoLocation";


export default class CityPicker extends React.Component {

    state = {
        city: {
            id: 1,
            title: "Москва"
        }
    };

    onSelect(city) {
        console.log('select', city)
        this.setState({
            city: city
        })
    }

    render() {
        return (
            <TouchableOpacity
                style={{paddingTop: 10}}
                onPress={() => Actions.CitySelector({onSelect: (c) => this.onSelect(c)})}
            >
                <Text style={[textStyle.defaultFont, {
                    paddingBottom: 5,
                    fontSize: 15,
                    color: '#0C21E2'
                }]}>{this.state.city.title}</Text>
            </TouchableOpacity>
        )
    }

}