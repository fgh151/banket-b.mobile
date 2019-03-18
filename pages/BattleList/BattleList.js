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
import GlobalState from "../../models/GlobalState";

export default class BattleList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
        };

        let gs =new GlobalState();
        gs.BattleList = this;

    }

    componentDidUpdate() {
        let refresh = this.props.refresh;
        this.props.refresh = false;
        return refresh;
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

                // console.log('User token', result);
                if (result === null) {
                    Actions.login();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/list')
                        .then(
                            (responseData) => {

                                console.log('update to ', responseData);

                                let items = responseData;
                                this.updateList(items);
                                CacheStore.set(CACHE_KEY, items, Config.lowCache);
                                this.setState({
                                    loaded: true,
                                });
                            }
                        )
                        .catch((e) => {
                            console.log('catch', e)
                        })
                        .finally((ff) => {
                            console.log('fail to update ', ff)
                    })
                }
            })
    }

    updateList(items) {

        console.log('update')

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

        if (this.state.items.length > 0) {
            //padding 10 - нужен для корректного отображения кружков новых сообщений
            return (
                <View style={[textStyle.rootViewWrapper, {padding: 0}]}>
                    <FlatList
                        style={textStyle.rootViewBig}
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
        if (this.state.items.length < 3) {
            return <Ad style={{marginBottom: -15, padding: 15}}/>
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