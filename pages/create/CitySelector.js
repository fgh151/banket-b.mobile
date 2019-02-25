import React from "react"

import {FlatList, Text, TouchableOpacity, View} from "react-native";
import GeoLocation, {City} from '../../helpers/GeoLocation';
import {Styles as textStyle} from "../../styles/Global";
import {Actions} from "react-native-router-flux";
import Loading from "../Loading";

export default class CitySelector extends React.Component {

    state = {
        cities: []
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        GeoLocation.getRemoteCities()
            .then((citiesArray) => {
                this.setState({cities: citiesArray});
            });
    }

    render() {

        if (this.state.cities.length > 0) {
            return (
                <View style={textStyle.rootViewWrapper}>
                    <FlatList
                        style={textStyle.rootViewBig}
                        data={this.state.cities}
                        renderItem={this.renderCity}
                    />
                </View>
            )
        } else {
            return (<Loading />);
        }
    }

    static setCity(city) {
        let c = new City();
        c.id = city.id;
        c.city = city;
        Actions.Form();
    }

    renderCity(city) {
        console.log(city);
        return (
            <TouchableOpacity
                onPress={() => CitySelector.setCity(city.item)}
            >
                <View style={{ borderColor: '#E0E0E0', borderBottomWidth: 1}}>
                    <Text style={{fontSize: 15, lineHeight:50}}>
                        {city.item.title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

}

