import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from "../../styles/Global";

export default class MetroPicker extends React.Component {

    state = {
        metro: {
            id: null,
            title: "Любое метро"
        }
    };

    constructor(props) {
        super(props);
    }

    onSelect(metro) {
        this.setState({
            metro: metro
        });
        this.props.onChange(metro);

    }

    render() {

        console.log('stations', this.props.stations);

        if (Array.isArray(this.props.stations) && this.props.stations.length > 0) {
            return (
                <TouchableOpacity
                    style={style.wrapper}
                    onPress={() => Actions.MetroSelector({
                        onSelect: (c) => this.onSelect(c),
                        stations: this.props.stations
                    })}
                >
                    <Text style={[textStyle.defaultFont, style.text]}>{this.state.metro.title}</Text>
                </TouchableOpacity>
            )
        }
        return null;
    }
}

const style = StyleSheet.create({
    wrapper: {
        paddingTop: 30,
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