import React, {Component} from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ProposalType} from '../types/ProposalType'
import Proposal from "../models/Proposal";
import {formatCost, formatDate, plural} from "../helpers/StringHelper";
import moment from "moment";
import {Button} from './Button';
import Client from '../http/Client';
import {Actions} from 'react-native-router-flux';

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
                <View style={{width: 250}}>
                    <Text style={{fontWeight: '500', fontSize: 18, color: '#000', textAlign: 'center', paddingBottom: 10}}>
                        {Proposal.getEventTypeNames(this.state.proposal.event_type)}
                        {this.renderProposalId()}
                    </Text>
                    <Text style={{textAlign:'center', paddingBottom: 10}}>
                        {formatDate(proposal.date, 'D MMMM')}, { moment( proposal.time, "HH:mm:ss").format("hh:mm")}
                    </Text>
                    <Text style={{textAlign:'center'}}>
                        <Text>
                        {proposal.guests_count} {plural(proposal.guests_count, 'гость', 'гостя', 'гостей')}
                        </Text>
                        <Text>
                            <Text>&nbsp;{formatCost(proposal.amount)} {"\u20bd"} на гостя</Text>
                        </Text>
                    </Text>
                </View>
            )
        } else {
            return null;
        }
    }
}

export class ProposalMenu extends React.Component{
    state = {
        modalVisible: false,
        proposal: currentProposal
    };

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
        console.log('toggle', this.state.modalVisible, this.state.proposal);
    };

    shouldComponentUpdate() {
        return this.state.proposal !== currentProposal;
    }

    componentDidMount() {
        this.setState({proposal: currentProposal})
    }


    renderServices() {

    if (this.state.proposal) {
        let services = [];
        if (this.state.proposal.floristics) {
            services.push(<Service text="Флористика"/>)
        }
        if (this.state.proposal.hall) {
            services.push(<Service text="Флористика"/>)
        }
        if (this.state.proposal.photo) {
            services.push(<Service text="Фото и видео"/>)
        }
        if (this.state.proposal.stylists) {
            services.push(<Service text="Стилисты"/>)
        }
        if (this.state.proposal.cake) {
            services.push(<Service text="Торты"/>)
        }
        if (this.state.proposal.transport) {
            services.push(<Service text="Транспорт"/>)
        }
        return services;
    }
    return null;
}

    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.toggleModal}>
                    <Image style={{margin: 15}} source={require('../assets/images/menu-dots.png')} on/>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}
                >
                    <TouchableOpacity style={style.overlay}
                                      onPress={this.toggleModal}
                    >
                        <View style={style.content}>
                            <View style={{marginBottom: 10}}>
                                <Text style={{textAlign: 'center'}}>Дополнительные услуги</Text>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                    flexWrap: 'wrap'
                                }}>
                                    {this.renderServices()}
                                </View>

                            </View>
                            <Button title={"Закончить батл"} onPress={() => this.deleteProposal()}/>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }

    deleteProposal() {
        const api = new Client(result);
        api.GET('/proposal/close/' + this.state.proposal.id )
            .then(
                () => {
                    this.setState({modalVisible: false});
                    Actions.BattleList();
                }
            );
    }

}


class Service extends React.Component{
    render() {
        return(
            <View style={style.inactiveWrapper}>
                <Text>
                    {this.props.text}
                </Text>
            </View>
        )
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
        padding: 15,
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