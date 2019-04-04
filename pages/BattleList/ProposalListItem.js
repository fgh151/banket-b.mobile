import React, {Component} from "react";
import {AsyncStorage, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import * as ArrayHelper from '../../helpers/ArrayHelper';
import {extractMessageCount} from '../../helpers/ArrayHelper';
import {formatCost, formatDate, plural} from '../../helpers/StringHelper';
import {db} from '../../Config';

import Proposal from "../../models/Proposal";
import Shadow from "../../components/Shadow";
import {Styles as textStyle} from "../../styles/Global";
import type {ProposalType} from "../../types/ProposalType";
import NewMessagesNotify from "../../components/NewMessagesNotify";

let shouldUpdate = false;

export function updateProposalList() {
    shouldUpdate = true;
}

export default class ProposalListItem extends Component {

    state = {
        newMessages: false,
    };

    constructor(props) {
        super(props);
    }

    static goToDialogs(proposal: Proposal) {
        Actions.DialogList({proposal: proposal})
    }

    shouldComponentUpdate() {
        let should = shouldUpdate;
        if (should) {
            shouldUpdate = false;
        }
        return should;
    }

    componentDidMount() {
        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.props.proposal.id + '/';
                db.ref(path).once('value', (snapshot) => {
                    let messagesCount = 0;
                    const value = snapshot.val();
                    let organizations = ArrayHelper.getKeys(value);
                    organizations.forEach((organization) => {
                        messagesCount = extractMessageCount(value);
                    });
                    if (messagesCount > 0) {
                        AsyncStorage.getItem('answers-count-read' + this.props.proposal.id)
                            .then((readedAnswersCount) => {

                                if (parseInt(readedAnswersCount) < messagesCount) {
                                    this.setState({newMessages: true});
                                }
                            });
                    }
                });
            })
    }

    renderProfit(proposal: ProposalType) {
        if (proposal.answers > 0) {
            return(<Text style={styles.profit}>{proposal.profit}% выгода</Text>)
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

// box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.19452);

const styles = StyleSheet.create({
    blockWrapper: {
        padding: 10,
        borderRadius: 5,
        //
        // boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.19452)",

        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1, //0.5,
        shadowRadius: 30,

        marginLeft: 15,
        marginRight: 15,
        marginTop: 13,
        marginBottom: 0,

        backgroundColor: 'white',


        ...Platform.select({
            ios: {
                paddingLeft: 15,
                paddingRight: 15
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