import React, {Component} from "react";
import {Text, View} from "react-native";
import {ProposalType} from '../types/ProposalType'
import Proposal from "../models/Proposal";
import {formatCost, formatDate, plural} from "../helpers/StringHelper";
import moment from "moment";

let currentProposal;

export function changeTitle(proposal: ProposalType) {
    currentProposal = proposal;
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
                <View style={{width: 250}}>
                    <Text style={{fontWeight: '500', fontSize: 20, color: '#000', textAlign: 'center'}}>
                        {Proposal.getEventTypeNames(this.state.proposal.event_type)}
                        {this.renderProposalId()}
                    </Text>
                    <Text style={{textAlign:'center'}}>
                        {formatDate(proposal.date, 'D MMMM')}, { moment( proposal.time, "HH:mm:ss").format("hh:mm")}
                    </Text>
                    <Text style={{textAlign:'center'}}>
                        <Text>
                        {proposal.guests_count} {plural(proposal.guests_count, 'гость', 'гостя', 'гостей')}
                        </Text>
                        <Text>
                            <Text>{formatCost(proposal.amount)} {"\u20bd"} на гостя</Text>
                        </Text>
                    </Text>
                </View>
            )
        } else {
            return null;
        }
    }
}