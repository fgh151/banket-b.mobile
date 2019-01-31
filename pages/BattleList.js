import React from 'react';
import {ListView, AsyncStorage} from "react-native";
import Loading from "./Loading";
import Proposal from "../models/Proposal";
import ProposalListItem from "./ProposalListItem";

export default class BattleList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
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
                if (result === null) {
                    Actions.login();
                } else {
                    const api = new Client(result);
                    api.GET('/proposal/list')
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

    render() {
        if (!this.state.loaded) {
            return <Loading/>;
        }

        if (this.state.dataSource.getRowCount() < 1) {
            return (
                <Grid>
                    <Row>
                        <Col style={LoginStyle.requestRow}>
                            <Text style={LoginStyle.requestText}>
                                У Вас нет ни одной заявки на проведение банкета
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            )
        }

        return (
            <List>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(proposal, rowMap) => this.renderProposal(proposal, rowMap)}
                />
            </List>
        );
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

    renderProposal(proposal: Proposal) {

        const deleteFunction = this.delete.bind(this);

        return (
            <ProposalListItem proposal={proposal} deleteHandler={deleteFunction}/>
        );
    }
}