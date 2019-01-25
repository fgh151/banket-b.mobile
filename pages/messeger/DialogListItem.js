import React, {Component} from "react";
import {AsyncStorage, Platform, Text, TouchableHighlight, View} from "react-native";
import {Actions} from "react-native-router-flux";
import App from "../../App";
import * as ArrayHelper from "../../helpers/ArrayHelper";

export default class DialogListItem extends Component {

    state = {
        modalVisible: false,
        newMessages: false,
        answersCount: null
    };
    dialog: any;
    address: any;

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    static goToMessenger(dialogId, organization, proposal) {
        Actions.messenger({
            dialogId: dialogId,
            proposal: proposal,
            organizationName: organization
        });
    }

    getAnswersCount() {
        return AsyncStorage.getItem(App.PROPOSALS_CACHE_KEY)
            .then((value) => {
                if (value != null) {
                    value = JSON.parse(value);
                    if (value['p_' + this.props.proposal.id]) {
                        if (value['p_' + this.props.proposal.id]['o_' + this.props.dialog.id]) {
                            const answers = value['p_' + this.props.proposal.id]['o_' + this.props.dialog.id];
                            let length = 0;
                            length = ArrayHelper.getKeys(answers).length;
                            return length
                        }
                    }
                }
            });
    }

    /**
     *
     * @returns {Promise}
     */
    getReadAnswersCount() {
        return AsyncStorage.getItem('answers-count-read' + this.props.proposal.id + '-' + this.props.dialog.id)
    }

    calcBageCount() {
        this.getAnswersCount()
            .then((answersCount) => {
                this.getReadAnswersCount()
                    .then((readAnswersCount) => {

                        console.log('GET DIALOG READ : ' + answersCount + ' READ ' + readAnswersCount + ' proposal ' + this.props.proposal.id + ' dialog ' + this.props.dialog.id);

                        let value = answersCount - readAnswersCount;
                        if (value > 0) {
                            this.setState({newMessages: true, answersCount: value});
                        }
                    })
            })
    }

    componentDidMount() {
        this.calcBageCount();
    }

    setModalVisible(visible) {
        // noinspection JSAccessibilityCheck
        this.setState({modalVisible: visible});
    }

    closeModal() {
        this.setModalVisible(!this.state.modalVisible);
    }

    renderNewMessages() {
        if (this.state.newMessages) {
            return (
                <View>
                    <Text>
                        {this.state.answersCount}
                    </Text>
                </View>
            )
        }
        return null;
    }

    render() {

        const buttonName = Platform.OS === 'ios' ? 'ios-more' : 'md-more';

        // noinspection JSUnresolvedFunction
        return (
            <View>
                <TouchableHighlight
                    onPress={() => DialogListItem.goToMessenger(this.props.dialog.id, this.props.dialog.name, this.props.proposal)}
                >
                    <View>
                        <Text style={[ProposalListStyle.text, {paddingLeft: 15}]}>{this.props.dialog.name}</Text>
                    </View>
                    {this.renderNewMessages()}
                </TouchableHighlight>
            </View>

        );
    }
}