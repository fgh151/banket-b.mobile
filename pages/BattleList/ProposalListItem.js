import React, {Component} from "react";
import {AsyncStorage, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import {formatCost, formatDate, plural} from '../../helpers/StringHelper';
import Proposal from "../../models/Proposal";
import Shadow from "../../components/Shadow";
import {Styles as textStyle, windowPadding} from "../../styles/Global";
import type {ProposalType} from "../../types/ProposalType";
import NewMessagesNotify from "../../components/NewMessagesNotify";
import Profit from "../../components/Profit";
import GlobalState from "../../models/GlobalState";
import EventBus from 'eventing-bus';
import {NEW_MESSAGE_EVENT, NEW_PROPOSALS_IDS, NewMessageEventParams} from "../../helpers/Push";
import {MESSAGE_READ_EVENT} from "../messeger/Messenger";

let shouldUpdate = false;

export function updateProposalList() {
    console.log('shoud upd');
    shouldUpdate = true;
}

export default class ProposalListItem extends Component {

    state = {
        newMessages: false,
    };

    newMessageSubscription;
    readMessageSubscription;

    constructor(props) {
        super(props);
    }

    static goToDialogs(proposal: Proposal) {
        Actions.DialogList({proposal: proposal})
    }

    componentWillMount() {

        //Рисуем кружок при новых сообщениях
        this.newMessageSubscription = EventBus.on(NEW_MESSAGE_EVENT, (data: NewMessageEventParams) => {
            if (parseInt(data.proposalId) === this.props.proposal.id) {
                this.setState({newMessages: true})
            }
        });

        this.readMessageSubscription = EventBus.on(MESSAGE_READ_EVENT, (data: NewMessageEventParams) => {
            if (parseInt(data.proposalId) === this.props.proposal.id) {
                this.setState({newMessages: false})
            }
        });

        //рисуем кружок если там что то есть
        let state = new GlobalState();
        if (this.props.proposal.id in state.newMessagesInProposal) {
            this.setState({newMessages: true});
        }

        AsyncStorage.getItem(NEW_PROPOSALS_IDS).then(data => {
            data = JSON.parse(data);
            if (this.props.proposal.id in data) {
                this.setState({newMessages: true})
            }
        })
    }

    componentWillUnmount() {
        this.newMessageSubscription();
        this.readMessageSubscription();
    }

    renderProfit(proposal: ProposalType) {
        if (proposal.answers > 0) {
            return (<Profit profit={proposal.profit}/>)
        }
        return null;
    }

    renderAnswersCount(proposal: ProposalType){

        if (proposal.answers > 0) {
            return(<Text style={{fontSize:13, lineHeight: 16}}>{proposal.answers} {plural(proposal.answers, 'ставка', 'ставки', 'ставок')}</Text>)
        }
        return null;
    }

    render() {
        const proposal = this.props.proposal;
        return (
            <Shadow style={styles.blockWrapper}>
                <NewMessagesNotify newMessages={this.state.newMessages}/>
                <TouchableOpacity
                    onPress={() => ProposalListItem.goToDialogs(proposal)}
                >
                    <View>
                        <View style={styles.rowWrapper}>
                            <View style={{marginBottom: 10}}>
                                <Text style={styles.eventType}>
                                    {Proposal.getEventTypeNames(proposal.event_type)}
                                </Text>
                            </View>
                            <View>
                                <Text style={{fontSize:15, lineHeight: 18}}>
                                    <Text style={[textStyle.boldFont, {fontSize:15, lineHeight: 18}]}>
                                        {formatCost(proposal.amount * proposal.guests_count)}
                                    </Text>
                                    <Text style={{fontSize:15, lineHeight: 18}}>
                                        &nbsp;{"\u20bd"}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.rowWrapper}>
                            <View style={{marginBottom: 10}}>
                                <Text style={{fontSize:15, lineHeight: 18}}>
                                    {formatDate(proposal.date, 'D MMM')}, {proposal.time}
                                </Text>
                            </View>
                            <View>
                                {this.renderProfit(proposal)}
                            </View>
                        </View>
                        <View style={[styles.rowWrapper, {marginBottom:5}]}>
                            <View>
                                <Text>
                                    <Text style={{fontSize:13, lineHeight: 16}}>{proposal.guests_count} {plural(proposal.guests_count, 'гость', 'гостя', 'гостей')}</Text>
                                    <Text style={{fontSize:13, lineHeight: 16}} >, {formatCost(proposal.amount)} {"\u20bd"} / чел.</Text>
                                </Text>
                            </View>
                            <View>
                                {this.renderAnswersCount(proposal)}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

            </Shadow>
        );
    }
}

const styles = StyleSheet.create({
    blockWrapper: {
        padding: 10,
        borderRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1, //0.5,
        shadowRadius: 30,
        marginLeft: windowPadding,
        marginRight: windowPadding,
        marginTop: 13,
        marginBottom: 0,
        backgroundColor: 'white',
        ...Platform.select({
            ios: {
                paddingLeft: windowPadding,
                paddingRight: windowPadding
            },
            android: {
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.19452)',
            },
        }),
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    eventType: {
        fontFamily: "Lato-Bold",
        fontSize: 15,
        lineHeight:18,
        color: '#1711E8'
    },
    time: {
        fontSize: 18,
    },
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    }
});