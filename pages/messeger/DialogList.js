import React, {Component} from "react";
import {AsyncStorage, ListView, Text, View, FlatList} from "react-native";
import Client from "../../http/Client";
import Loading from "../Loading";
import {Actions} from "react-native-router-flux";
import CacheStore from 'react-native-cache-store';
import DialogListItem from './DialogListItem';
import Config from "../../Config";
import Proposal from "../../models/Proposal";
import {changeTitle} from "../../components/ProposalBar";


import Empty from './Empty';

export default class DialogList extends Component {

    state = {
        items:[],
        listTitle: '',
        loaded: false
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
                    Actions.login();
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

        console.log('dialog list', this.props.proposal);

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

        console.log(this.state.items);


        return (
            <View>

                <FlatList
                    data={this.state.items}
                    renderItem={(item) => this.renderItem(item)}
                />

            </View>
        );
    }


    renderItem(item) {

        console.log('props', this.props.proposal);

        // return null;
        // const deleteFunction = this.delete.bind(this);
        return <DialogListItem dialog={item}  proposal={this.props.proposal}/>
    }
}
