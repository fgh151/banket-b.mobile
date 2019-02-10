import React from "react"

import {FlatList, Text, TouchableOpacity, View} from "react-native";
import GeoLocation, {City} from '../../helpers/GeoLocation';
import {Styles as textStyle} from "../../styles/Global";
import {Actions} from "react-native-router-flux";

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


        return (
            <View style={textStyle.rootView}>
                <FlatList
                    data={this.state.cities}
                    renderItem={this.renderCity}
                />
            </View>
        )
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
            <TouchableOpacity onPress={() => CitySelector.setCity(city.item)}>
                <View style={{height: 50, borderColor: '#E0E0E0', borderBottomWidth: 1}}>
                    <Text style={{fontSize: 15}}>
                        {city.item.title} {city.item.id}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

}

