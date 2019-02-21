import React from 'react';
import {AsyncStorage, FlatList, View} from "react-native";
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

export default class BattleList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
        };
    }

    componentDidUpdate() {
        let refresh = this.props.refresh;
        this.props.refresh = false;
        return refresh;
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
            loaded: true,
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

        console.log(this.state.items);
        if (this.state.items.length > 0) {
            //padding 10 - нужен для корректного отображения кружков новых сообщений
            return (
                <View style={[textStyle.rootViewWrapper, {padding: 10}]}>
                    <FlatList
                        style={textStyle.rootView}
                        ListEmptyComponent={<View/>}
                        data={this.state.items}
                        renderItem={this.renderProposal}
                    />

                    {this.renderAd()}
                </View>
            );
        } else {
            return (<Loading/>);
        }
    }

    renderAd() {
        if (this.state.items.length < 4) {
            return <Ad style={{marginBottom: -10}}/>
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
                this.fetchData(true);
            });
    }

    renderProposal(proposal: ProposalListItemType) {
        return (
            <ProposalListItem proposal={proposal.item} deleteHandler={() => this.delete(proposal.item.id)}/>
        );
    }
}