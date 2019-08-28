import React from "react"

import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {City} from '../../helpers/GeoLocation';
import {Styles as textStyle} from "../../styles/Global";
import {Actions} from "react-native-router-flux";
import Loading from "../Loading";
import AS from '@react-native-community/async-storage'
import {STORAGE_GEO_CACHE_KEY} from "../../helpers/Constants";

export default class CitySelector extends React.Component {

    state = {
        cities: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        AS.getItem(STORAGE_GEO_CACHE_KEY)
            .then((citiesArray) => {
                this.setState({cities: JSON.parse(citiesArray)});
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
            return (<Loading/>);
        }
    }

    setCity(city) {
        let c = new City();
        c.id = city.id;
        c.city = city;

        this.props.onSelect(city);


        Actions.popTo('Form');
    }

    renderCity = (city) => {
        return (
            <TouchableOpacity
                onPress={() => this.setCity(city.item)}
            >
                <View style={{borderColor: '#E0E0E0', borderBottomWidth: 1}}>
                    <Text style={{fontSize: 15, lineHeight: 50}}>
                        {city.item.title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

}
