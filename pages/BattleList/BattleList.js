import React from 'react';
import {AsyncStorage, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Loading from "../Loading";
import {ProposalListItemType} from "../../types/ProposalType";
import ProposalListItem from "./ProposalListItem";
import CacheStore from 'react-native-cache-store';
import Client from '../../http/Client';
import Config from '../../Config';
import Empty from './Empty';
import {Styles as textStyle} from "../../styles/Global";
import Ad from "../../components/Ad";
import trackEvent from "../../helpers/AppsFlyer";
import GlobalState from "../../models/GlobalState";
import {Actions} from "react-native-router-flux";
import {ifIphoneX} from "react-native-iphone-x-helper";

function updateState(state) {
    this.setState(state);
}

export class RightButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
        updateState = updateState.bind(this);
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

export default class BattleList extends React.PureComponent {

    constructor(props) {


        super(props);
        this.state = {
            items: [],
            loaded: false,
            refreshing: false,
        };

        let gs = new GlobalState();
        gs.BattleList = this;


        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.fetchData(true);
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
            }
        });
        this.getRemoteList();
    }

    getRemoteList() {
        const CACHE_KEY = 'proposal-list';
        AsyncStorage.getItem('battle@token')
            .then((result) => {
                if (result === null) {
                    Actions.login();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/list', {}, 'from list')
                        .then(
                            (responseData) => {
                                let items = responseData;
                                this.updateList(items);
                                CacheStore.set(CACHE_KEY, items, Config.lowCache);
                                this.setState({
                                    loaded: true,
                                });
                            }
                        )
                }
            })
    }

    updateList(items) {
        // noinspection JSAccessibilityCheck
        this.setState(
            {
                items: items,
                loaded: true,
                refreshing: false
            },
            updateState({items: items})
        );
    }

    onRefresh() {
        const self = this;
        this.setState({refreshing: true}, function () {
            self.getRemoteList()
        });
    }

    render() {

        if (!this.state.loaded) {
            return <Loading/>;
        }

        if (this.state.items.length < 1) {
            return (
                <Empty/>
            )
        }

        if (this.state.items.length > 0) {
            return (
                <View style={[textStyle.rootViewWrapper, style.root]}>
                    <FlatList
                        style={[textStyle.rootViewBig, {paddingTop: 10}]}
                        ListEmptyComponent={<View/>}
                        data={this.state.items}
                        renderItem={this.renderProposal}
                        refreshControl={
                            <RefreshControl
                                colors={['#0C21E2', '#00D800', '#D0021B']}
                                tintColor={'#0C21E2'}
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />

                    {this.renderAd()}
                </View>
            );
        } else {
            return (<Loading/>);
        }
    }

    renderAd() {
        if (this.state.items.length < 3) {
            return <Ad style={style.ad}/>
        }
        return null;
    }

    /**
     * Закрыть заявку
     * @param dialogId
     */
    delete(dialogId) {
        AsyncStorage.getItem('battle@token')
            .then((result) => {
                if (result === null) {
                    Actions.login();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/close/' + dialogId)
                        .then(() => {
                            this.fetchData(true);
                            trackEvent('proposalClose', dialogId);
                        });
                }
            });
    }

    renderProposal(proposal: ProposalListItemType) {
        return (
            <ProposalListItem proposal={proposal.item} deleteHandler={() => this.delete(proposal.item.id)}/>
        );
    }
}

const style = StyleSheet.create({
    root: {
        padding: 0,
        ...Platform.select({
            ios: {
                marginTop: 0
            },
            android: {
                marginTop: 9
            },
        }),
    },
    ad: {
        marginBottom: -18,
        padding: 15,
        ...ifIphoneX({
            marginBottom: 15,
        })
    }
})