import React, {Component} from "react";
import {AsyncStorage, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import App from '../App';
import * as ArrayHelper from '../helpers/ArrayHelper';
import {formatCost, plural, formatDate} from '../helpers/StringHelper';
import Config from '../Config';

import Proposal from "../models/Proposal";
import Shadow from "../components/Shadow";
import {Styles as textStyle} from "../styles/Global";
import moment from 'moment';

export default class ProposalListItem extends Component {

    state = {
        newMessages: false,
        // answersCount: null
    };

    constructor(props) {
        super(props);
    }

    static goToDialogs(proposal: Proposal) {


        console.log('go to dialog list', proposal);

        Actions.DialogList({proposal: proposal})
    }

    componentDidMount() {


        // AsyncStorage.getItem(App.PROPOSALS_CACHE_KEY)
        //     .then((value) => {
        //         if (value['p_' + this.props.proposal.id]) {
        //             const answers = value['p_' + this.props.proposal.id];
        //
        //             let length = 0;
        //             const orgs = ArrayHelper.getKeys(answers);
        //
        //             orgs.forEach((organizationId) => {
        //
        //                 console.log('VALUE size ' + this.props.proposal.id + ' ' + organizationId + ' ');
        //                 console.log(value['p_' + this.props.proposal.id][organizationId]);
        //
        //                 // length += ArrayHelper.getKeys(value['p_' + this.props.proposal.id][organizationId]).length;
        //             });
        //
        //             AsyncStorage.getItem('answers-count-' + this.props.proposal.id)
        //                 .then((value) => {
        //                     AsyncStorage.getItem('answers-count-read' + this.props.proposal.id)
        //                         .then((value) => {
        //                             if (value !== null) {
        //                                 length = value - length;
        //                                 if (length > 0) {
        //                                     AsyncStorage.setItem('answers-count-' + this.props.proposal.id, length, Config.lowCache);
        //                                     this.setState({newMessages: true, answersCount: length});
        //                                 }
        //                             } else {
        //                                 this.setState({newMessages: true, answersCount: length});
        //                                 AsyncStorage.setItem('answers-count-' + this.props.proposal.id, length, Config.lowCache)
        //                             }
        //                         });
        //                 });
        //         }
        //     });
    }


    renderNewMessages() {
        if (this.state.newMessages) {
            return (
                <View style={styles.round}>

                </View>
            )
        }
        return null;
    }

    render() {

        const proposal = this.props.proposal;

        console.log(proposal);


        return (
            <Shadow style={styles.blockWrapper}>
                {this.renderNewMessages()}
                <TouchableOpacity
                    onPress={() => ProposalListItem.goToDialogs(proposal)}
                >
                    <View>
                        <View style={styles.rowWrapper}>
                            <View>

                                <Text>

                                <Text style={styles.eventType}>
                                    {Proposal.getEventTypeNames(proposal.event_type)}
                                </Text>

                                    <Text style={styles.time}>
                                        &nbsp;{formatDate(proposal.date)}, { moment( proposal.time, "HH:mm:ss").format("hh:mm")}
                                    </Text>

                                </Text>
                            </View>
                            <View>
                                <Text>
                                    <Text style={textStyle.boldFont}>
                                        {formatCost(proposal.amount * proposal.guests_count)}
                                    </Text>
                                    <Text>
                                        &nbsp;{"\u20bd"}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.rowWrapper}>
                            <View>
                                <Text>{proposal.guests_count} {plural(proposal.guests_count, 'гость', 'гостя', 'гостей')}</Text>
                            </View>
                            <View>
                                <Text style={styles.profit}>80% выгода</Text>
                            </View>
                        </View>
                        <View style={styles.rowWrapper}>
                            <View>
                                <Text>{formatCost(proposal.amount)} {"\u20bd"} / чел</Text>
                            </View>
                            <View>
                                <Text>5 ставок</Text>
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
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 1,
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    eventType: {
        fontFamily: "Lato-Bold",
        fontSize: 18,
        color: '#1711E8'
    },
    time: {
        fontSize: 18,
    },
    profit:{
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
    round:{
        height: 22,
        width: 22,
        backgroundColor: '#D0021B',
        borderRadius: 11,


        borderWidth: 5,
        borderColor: '#ec9aa4',


        position: 'absolute',
        top: -11,
        right:-11
    }
});