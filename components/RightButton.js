import React from 'react';
import {AsyncStorage, Text, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import CacheStore from "react-native-cache-store";
import Client from "../http/Client";
import Config from "../Config";

export default class RightButton extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    /**
     * fetch data from API
     */
    fetchData(clearCache = false) {

        const CACHE_KEY = 'proposal-list';
        if (clearCache) {
            CacheStore.remove(CACHE_KEY);
        }

        CacheStore.get(CACHE_KEY).then((value) => {
            if (value !== null) {
                this.updateList(value);
            } else {
                this.getRemoteList();
            }
        });
        this.getRemoteList();
    }

    getRemoteList() {
        const CACHE_KEY = 'proposal-list';
        AsyncStorage.getItem('battle@token')
            .then((result) => {

                // console.log('User token', result);
                if (result === null) {
                    Actions.login();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/list')
                        .then(
                            (responseData) => {


                                let items = responseData;
                                this.updateList(items);
                                CacheStore.set(CACHE_KEY, items, Config.lowCache);
                            }
                        )
                }
            })
    }

    updateList(items) {
        // noinspection JSAccessibilityCheck
        this.setState({
            items: items,
        });
    }

    render() {
        if (this.state.items.length > 0) {
            return (
                <TouchableOpacity
                    style={{height: 60, paddingTop: 20}}
                    onPress={() => Actions.Form()}
                >
                    <Text style={{
                        color: '#0C20E3',
                        fontSize: 15,
                        textAlign: 'right', marginRight: 15
                    }}>
                        Новый батл
                    </Text>
                </TouchableOpacity>
            )
        }
        return null
    }

}