import React, {Component} from "react";
import {AsyncStorage, FlatList, Picker, Text, View} from "react-native";
import Client from "../../http/Client";
import Loading from "../Loading";
import {Actions} from "react-native-router-flux";
import CacheStore from 'react-native-cache-store';
import DialogListItem from './DialogListItem';
import Config from "../../Config";
import {changeTitle} from "../../components/ProposalBar";


import Empty from './Empty';
import type {Organization} from "../../types/Organization";
import {Styles as textStyle} from "../../styles/Global";

export default class DialogList extends Component {

    state = {
        items: [],
        listTitle: '',
        loaded: false,
        activeSort:1
    };


    componentDidMount() {
        this.fetchData();
        changeTitle(this.props.proposal);
    }

    /**
     * fetch data from API
     */
    fetchData(clearCache = false) {
        const CACHE_KEY = 'dialog-list' + this.props.proposal.id;
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
        const CACHE_KEY = 'dialog-list';
        AsyncStorage.getItem('battle@token')
            .then((result) => {
                if (result === null) {
                    Actions.LoginPhone();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/dialogs/' + this.props.proposal.id)
                        .then(
                            (responseData) => {

                                this.updateList(responseData);
                                CacheStore.set(CACHE_KEY, responseData, Config.lowCache);
                            }
                        )
                }
            })
    }

    updateList(items) {
        // noinspection JSAccessibilityCheck
        this.setState({
            items: items,
            loaded: true,
        });
    }

    delete(proposalId, dialogId) {
        AsyncStorage.getItem('battle@token')
            .then((result) => {
                if (result === null) {
                    Actions.login();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/delete/' + proposalId + '/' + dialogId)
                        .then(this.fetchData());
                }
                this.fetchData();
            });
    }

    render() {
        if (!this.state.loaded) {
            return (
                <Loading/>
            )
        }

        if (this.state.items.length < 1) {
            return (
                <Empty/>
            )
        }

        return (
            <View style={textStyle.rootView}>

                <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>

                    <View style={{ flexDirection: 'row'}}>
                        <View style={{ width: '60%'}}>
                            <Text style={textStyle.boldFont}>Предложения ресторанов</Text>
                        </View>
                        <View style={{width: '40%'}}>
                            <Picker
                                style={{width: '100%'}}
                                selectedValue={this.state.activeSort}
                                prompt="Сортировка"
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({activeSort: itemValue});
                                    switch (itemValue) {
                                        case 1 : {
                                            this.state.items.sort(this.comparePrice);
                                            break
                                        }
                                        case 2 : {
                                            this.state.items.sort(this.compareLastMessage);
                                            break
                                        }
                                        case 3 : {
                                            this.state.items.sort(this.compareRating);
                                            break
                                        }
                                    }
                                }}>
                                <Picker.Item label="Лучшие" value="1"/>
                                <Picker.Item label="Последние" value="2"/>
                                <Picker.Item label="Рейтинг" value="3"/>
                            </Picker>
                        </View>
                    </View>

                    <View style={{}}>
                        <FlatList
                            data={this.state.items}
                            renderItem={(item) => this.renderItem(item)}
                        />
                    </View>

                </View>
            </View>
        );
    }

    compareRating(a: Organization, b: Organization) {
        return this._compare(a, b, 'rating');
    }

    comparePrice(a: Organization, b: Organization) {
        return this._compare(a, b, 'profit');
    }

    compareLastMessage(a: Organization, b: Organization) {
        return this._compare(a, b, 'lastMessage');
    }

    _compare(a: Organization, b: Organization, field: string) {
        if (a[field] < b[field])
            return -1;
        if (a[field] > b[field])
            return 1;
        return 0;
    }


    renderItem(item) {

        // console.log('props', this.props.proposal);

        // return null;
        // const deleteFunction = this.delete.bind(this);
        return <DialogListItem dialog={item} proposal={this.props.proposal}/>
    }
}
