import React, {Component} from "react";
import {AsyncStorage, FlatList, Image, RefreshControl, StyleSheet, Text, View} from "react-native";
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
import PickerSelect from '../../components/PickerSelect';
import GlobalState from "../../models/GlobalState";

export default class DialogList extends Component {

    state = {
        items: [],
        listTitle: '',
        loaded: false,
        selectedSort: undefined,
        refreshing: false,
    };

    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
    }

    static compareRating(a: Organization, b: Organization) {
        return DialogList._compare(a, b, 'rating');
    }

    static comparePrice(a: Organization, b: Organization) {
        return DialogList._compare(a, b, 'profit');
    }

    static compareLastMessage(a: Organization, b: Organization) {
        return DialogList._compare(a, b, 'lastMessage');
    }

    static _compare(a: Organization, b: Organization, field: string) {
        if (a[field] < b[field])
            return 1;
        if (a[field] > b[field])
            return -1;
        return 0;
    }

    componentDidMount() {
        this.fetchData();
        changeTitle(this.props.proposal);

        let gs = new GlobalState();
        gs.DialogList = this;
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

                                console.log(responseData);

                                this.updateList(responseData);
                                CacheStore.set(CACHE_KEY, responseData, Config.lowCache);
                            }
                        )
                }
            })
    }

    onRefresh() {
        const self = this;
        this.setState({refreshing: true}, function () {
            self.getRemoteList()
        });
    }

    updateList(items) {
        // noinspection JSAccessibilityCheck
        this.setState({
            items: items,
            loaded: true,
            refreshing: false
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

    renderPicker() {
        const placeholder = {
            label: 'Лучшие',
            value: 1
        };

        const variants = [
            // {label: "Лучшие", value: 1},
            {label: "Последние", value: 2},
            {label: "Рейтинг ресторана", value: 3},
        ];

        return (
            <PickerSelect
                Icon={() => <Image source={require('../../assets/images/down.png')}/>}
                placeholderTextColor='#9EA0A4'
                placeholder={placeholder}
                items={variants}
                value={this.state.selectedSort}
                useNativeAndroidPickerStyle={false}
                selectedValue={variants[0]}
                style={pickerStyle}
                onValueChange={(itemValue) => {
                    this.setState({selectedSort: itemValue.value});
                    switch (itemValue) {
                        case 1 : {
                            this.setState({items: this.state.items.sort(DialogList.comparePrice)});
                            break
                        }
                        case 2 : {
                            this.setState({items: this.state.items.sort(DialogList.compareLastMessage)});
                            break
                        }
                        case 3 : {
                            this.setState({items: this.state.items.sort(DialogList.compareRating)});
                            break
                        }
                    }
                }}
            />
        );
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

        if (this.state.items.length > 0) {
            return (
                <View style={textStyle.rootViewWrapper}>
                    <View style={textStyle.rootViewBig}>

                        <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                    <Text
                                        style={[textStyle.boldFont, {fontWeight: '800', fontSize: 15, lineHeight: 18}]}>Предложения
                                        ресторанов</Text>
                                </View>
                                <View>
                                    {this.renderPicker()}
                                </View>
                            </View>

                            <View style={{marginTop: 10, marginLeft: -11, marginRight: -11}}>
                                <FlatList
                                    data={this.state.items}
                                    renderItem={(item) => this.renderItem(item)}
                                    refreshControl={
                                        <RefreshControl
                                            colors={['#0C21E2', '#00D800', '#D0021B']}
                                            tintColor={'#0C21E2'}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                            size={'large'}
                                        />
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }

    renderItem(item) {
        return <DialogListItem dialog={item} proposal={this.props.proposal}/>
    }
}

const pickerStyle = StyleSheet.create({
    inputIOS: {
        marginRight: 10
    },
    inputAndroidContainer: {},
    inputAndroid: {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: -5,
        marginRight: 10
    }
});