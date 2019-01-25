import React, {Component} from "react";
import {AsyncStorage, ListView, Text, View} from "react-native";
import Client from "../../http/Client";
import Loading from "../Loading";
import {Actions} from "react-native-router-flux";
import CacheStore from 'react-native-cache-store';
import DialogListItem from './DialogListItem';
import Config from "../../Config";

export default class DialogList extends Component {

    static proposal;

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            listTitle: '',
            loaded: false
        };

        this.proposalId = this.props.proposal.id;

        DialogList.proposal = this.props.proposal.id;

        console.log('Proposal');
        console.log(this.props.proposal);
    }

    componentDidMount() {
        this.fetchData();
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
                    api.GET('/proposal/dialogs/' + this.proposalId)
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
            dataSource: this.state.dataSource.cloneWithRows(items),
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

        const deleteFunction = this.delete.bind(this);

        if (!this.state.loaded) {
            return (
                <View>
                    <Loading/>
                </View>
            )
        }

        if (this.state.dataSource.getRowCount() < 1) {
            return (
                <View>

                    <Text>
                        На Вашу заявку пока не поступило предложений от наших партнеров
                    </Text>
                </View>
            )
        }

        return (
            <View>
                <View>
                    <Text>{this.props.proposal.date} на {this.props.proposal.guests_count} человека</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(dialog, rowMap) => (
                        <DialogListItem dialog={dialog} proposal={this.props.proposal}
                                        deleteHandler={deleteFunction}/>
                    )}
                >
                </ListView>
            </View>
        );
    }
}
