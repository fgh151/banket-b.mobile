import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {ProposalType} from '../types/ProposalType'
import Proposal from "../models/Proposal";
import {formatCost, formatDate, plural} from "../helpers/StringHelper";
import {windowPadding} from "../styles/Global";

let currentProposal;

export function changeTitle(proposal: ProposalType) {
    currentProposal = proposal;
}

export function getCurrentProposal() {
    return currentProposal;
}

export default class ProposalBar extends Component {
    state = {
        proposal: currentProposal
    };

    shouldComponentUpdate() {
        return this.state.proposal !== currentProposal;
    }

    componentDidMount() {
        this.setState({proposal: currentProposal})
    }

    renderProposalId() {
        if (__DEV__ === true) {
            return (
                <Text> {this.state.proposal.id}</Text>
            )
        }
        return null;

    }

    render() {
        if (this.state.proposal) {
            let proposal = this.state.proposal;
            return (
                <View style={{width: 260, marginTop: 10}}>
                    <Text style={{
                        fontSize: 15,
                        lineHeight: 18,
                        color: '#000',
                        textAlign: 'center',
                        paddingBottom: 10,
                        fontFamily: "Lato-Bold"
                    }}>
                        {Proposal.getEventTypeNames(this.state.proposal.event_type)}
                        {this.renderProposalId()}
                    </Text>
                    <Text style={{textAlign:'center', paddingBottom: 10, fontSize:15, lineHeight:15}}>
                        {formatDate(proposal.date, 'D MMMM')}, {proposal.time}
                    </Text>
                    <Text style={{textAlign: 'center', opacity: .8, fontSize: 13, lineHeight: 13, paddingBottom: 10}}>
                        <Text>
                        {proposal.guests_count} {plural(proposal.guests_count, 'гость', 'гостя', 'гостей')}
                        </Text>
                        <Text>
                            <Text>&nbsp;&nbsp;&nbsp;&nbsp;{formatCost(proposal.amount)} {"\u20bd"} / чел</Text>
                        </Text>
                        <Text>
                            <Text>&nbsp;&nbsp;&nbsp;&nbsp;{formatCost(proposal.amount * proposal.guests_count)} {"\u20bd"}</Text>
                        </Text>
                    </Text>
                </View>
            )
        } else {
            return null;
        }
    }
}

const style = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    content: {
        width: '100%',
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: windowPadding,
        position: 'absolute',
        left: 0,
        bottom: 0
    },
    inactiveWrapper:{
        paddingLeft: 22,
        paddingRight:22,
        paddingTop:11,
        paddingBottom:11,
        margin:10,
        borderRadius:20,
        backgroundColor: '#E7E7E7',
        alignSelf: 'flex-start'
    },
});