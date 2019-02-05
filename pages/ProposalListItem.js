import React, {Component} from "react";
import {AsyncStorage, Modal, Platform, TouchableHighlight} from "react-native";
import {Actions} from "react-native-router-flux";
import moment from 'moment';
import ru from 'moment/locale/ru'
import App from '../App';
import * as ArrayHelper from '../helpers/ArrayHelper';
import Config from '../Config';

import Proposal from "../models/Proposal";

export default class ProposalListItem extends Component {

    state = {
        modalVisible: false,
        newMessages: false,
        answersCount: null
    };

    constructor(props) {
        super(props);
    }

    static goToDialogs(proposal : Proposal) {


        Actions.dialogList({proposal: proposal})
    }

    componentDidMount() {


        AsyncStorage.getItem(App.PROPOSALS_CACHE_KEY)
            .then((value) => {
                if (value['p_' + this.props.proposal.id]) {
                    const answers = value['p_' + this.props.proposal.id];

                    let length = 0;
                    const orgs = ArrayHelper.getKeys(answers);

                    orgs.forEach((organizationId) => {

                        console.log('VALUE size ' + this.props.proposal.id + ' ' + organizationId + ' ');
                        console.log(value['p_' + this.props.proposal.id][organizationId]);

                        // length += ArrayHelper.getKeys(value['p_' + this.props.proposal.id][organizationId]).length;
                    });

                    AsyncStorage.getItem('answers-count-' + this.props.proposal.id)
                        .then((value) => {
                            AsyncStorage.getItem('answers-count-read' + this.props.proposal.id)
                                .then((value) => {
                                    if (value !== null) {
                                        length = value - length;
                                        if (length > 0) {
                                            AsyncStorage.setItem('answers-count-' + this.props.proposal.id, length, Config.lowCache);
                                            this.setState({newMessages: true, answersCount: length});
                                        }
                                    } else {
                                        this.setState({newMessages: true, answersCount: length});
                                        AsyncStorage.setItem('answers-count-' + this.props.proposal.id, length, Config.lowCache)
                                    }
                                });
                        });
                }
            });
    }

    setModalVisible(visible) {
        // noinspection JSAccessibilityCheck
        this.setState({modalVisible: visible});
    }

    renderNewMessages() {
        if (this.state.newMessages) {
            return (
                <View>
                    <Text style={{color: 'white', width: 25, textAlign: 'center'}}>
                        {this.state.answersCount}
                    </Text>
                </View>
            )
        }
        return null;
    }

    render() {
        moment.locale('ru');
        let dateMoment = moment(this.props.proposal.date);
        let date = dateMoment.format('D MMMM YYYY');

        const buttonName = Platform.OS === 'ios' ? 'ios-more' : 'md-more';

        // noinspection JSUnresolvedFunction
        return (
            <View>
                <View>
                    <TouchableHighlight
                        onPress={() => ProposalListItem.goToDialogs(this.props.proposal)}
                    >
                        <View style={{}} size={8}>
                                <View>
                                    <Text>{date}</Text>
                                </View>
                                <View>
                                    <Text>{this.props.proposal.guests_count} человек
                                        по {this.props.proposal.amount}</Text>
                                </View>
                        </View>
                    </TouchableHighlight>
                    <View>
                        {this.renderNewMessages()}
                    </View>

                </View>

                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.state.modalVisible = false}
                    >
                        <View>
                            <View>
                                <ProposalInfoPopup proposal={this.props.proposal}/>
                                <View>
                                    <Button
                                        onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible);
                                        }}>
                                        <Text>Закрыть</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }

}