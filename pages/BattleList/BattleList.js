import React from 'react';
import {AppState, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AS from '@react-native-community/async-storage'
import Loading from "../Loading";
import {ProposalListItemType} from "../../types/ProposalType";
import ProposalListItem from "./ProposalListItem";
import CacheStore from '../../components/CacheStore';
import Client from '../../http/Client';
import Config from '../../Config';
import Empty from './Empty';
import {Styles as textStyle, windowPadding} from "../../styles/Global";
import trackEvent from "../../helpers/AppsFlyer";
import {Actions} from "react-native-router-flux";
import {ifIphoneX} from "react-native-iphone-x-helper";
import {BUS_CLOSE_PROPOSAL, STORAGE_AUTH_TOKEN, STORAGE_PROPOSALS_LIST_CACHE_KEY} from "../../helpers/Constants";
import EventBus from "eventing-bus";
import log from "../../helpers/firebaseAnalytic";

let showButtonState = false;

function showButtonFunction(show) {
    showButtonState = show;
    this.setState({show: show});
}

let showButton = null;

export class RightButton extends React.Component {
    state = {
        show: showButtonState,
    };

    render() {
        log(this, 'render');
        if (this.state.show) {
            return (
                <TouchableOpacity
                    style={{height: 60, paddingTop: 20}}
                    onPress={() => Actions.Form()}
                >
                    <Text style={{
                        color: '#0C20E3',
                        fontSize: 15,
                        textAlign: 'right', marginRight: windowPadding
                    }}>
                        Новый батл
                    </Text>
                </TouchableOpacity>
            )
        }
        return null
    }

    componentDidMount() {
        showButton = showButtonFunction.bind(this);
    }

    componentWillUnmount() {
        showButton = null;
    }
}

export default class BattleList extends React.PureComponent {

    deleteProposalHandler;

    readMessagesHandler;

    constructor(props) {


        super(props);
        this.state = {
            items: [],
            loaded: false,
            refreshing: false,

            appState: AppState.currentState,

        };

        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.fetchData(true);
        AppState.addEventListener('change', this._handleAppStateChange);

        this.deleteProposalHandler = EventBus.on(BUS_CLOSE_PROPOSAL, () => {
            this.fetchData(true);
        });

        this.readMessagesHandler = EventBus.on('proposal_read', () => {
            this.setState({items: [], refreshing: true}, () => {
                this.getRemoteList()
            });
        });

    }


    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.deleteProposalHandler();
        this.readMessagesHandler();
    }

    _handleAppStateChange = (nextAppState) => {

        if (nextAppState === 'active') {
            this.fetchData(true);

            this.deleteProposalHandler = EventBus.on(BUS_CLOSE_PROPOSAL, () => {
                this.fetchData(true);
            });

            this.readMessagesHandler = EventBus.on('proposal_read', () => {
                this.setState({items: [], refreshing: true}, () => {
                    this.getRemoteList()
                });
            });


        } else {
            this.deleteProposalHandler();
            this.readMessagesHandler();
        }
    };

    /**
     * fetch data from API
     */
    fetchData(clearCache = false) {

        if (clearCache) {
            CacheStore.remove(STORAGE_PROPOSALS_LIST_CACHE_KEY);
        }

        CacheStore.get(STORAGE_PROPOSALS_LIST_CACHE_KEY).then((value) => {
            if (value !== null) {
                this.updateList(value);
            }
        });
        this.getRemoteList();
    }

    getRemoteList() {
        this.setState({
            loaded: false, items: []
        });

        const CACHE_KEY = 'proposal-list';
        if (this.props.token) {
            const api = new Client(this.props.token);
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
        } else {
            AS.getItem(STORAGE_AUTH_TOKEN)
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
    }

    updateList(items) {
        // noinspection JSAccessibilityCheck
        this.setState(
            {
                items: items,
                loaded: true,
                refreshing: false
            },
            () => {
                if (showButton !== null) {
                    showButton(items.length > 0)
                }
            }
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
        // if (this.state.items.length < 3) {
        //     return <Ad style={style.ad}/>
        // }
        return null;
    }

    /**
     * Закрыть заявку
     * @param dialogId
     */
    delete(dialogId) {
        AS.getItem(STORAGE_AUTH_TOKEN)
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
                marginTop: 0,
            },
            android: {
                marginTop: 9,
                marginBottom: windowPadding
            },
        }),
    },
    ad: {
        marginBottom: -18,
        padding: windowPadding,
        ...ifIphoneX({
            marginBottom: windowPadding,
        })
    }
});
