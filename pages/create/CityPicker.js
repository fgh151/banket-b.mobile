import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from "../../styles/Global";

export default class CityPicker extends React.Component {

    state = {
        city: {
            id: 1,
            title: "Москва"
        }
    };

    constructor(props) {
        super(props);
    }

    onSelect(city) {
        console.log('select', city);
        this.setState({
            city: city
        });
        this.props.onChange(city, city.id)
    }

    render() {
        return (
            <TouchableOpacity
                style={style.wrapper}
                onPress={() => Actions.CitySelector({onSelect: (c) => this.onSelect(c)})}
            >
                <Text style={[textStyle.defaultFont, style.text]}>{this.state.city.title}</Text>
            </TouchableOpacity>
        )
    }
}

const style = StyleSheet.create({
    wrapper: {
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    },
    text: {
        paddingBottom: 2,
        fontSize: 15,
        lineHeight: 18,
        color: '#0C21E2',
        fontFamily: "Lato-Regular",
    }
});