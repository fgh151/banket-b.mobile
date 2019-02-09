import React, {Component} from "react";
import {AsyncStorage, Platform, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Actions} from "react-native-router-flux";
import App from "../../App";
import * as ArrayHelper from "../../helpers/ArrayHelper";
import Shadow from "../../components/Shadow";

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
    }

    static goToMessenger(dialogId, organization, proposal) {
        Actions.Messenger({
            dialogId: dialogId,
            proposal: proposal,
            organizationName: organization
        });
    }

    getAnswersCount() {
        // return AsyncStorage.getItem(App.PROPOSALS_CACHE_KEY)
        //     .then((value) => {
        //         if (value != null) {
        //             value = JSON.parse(value);
        //             if (value['p_' + this.props.proposal.id]) {
        //                 if (value['p_' + this.props.proposal.id]['o_' + this.props.dialog.id]) {
        //                     const answers = value['p_' + this.props.proposal.id]['o_' + this.props.dialog.id];
        //                     let length = 0;
        //                     length = ArrayHelper.getKeys(answers).length;
        //                     return length
        //                 }
        //             }
        //         }
        //     });
    }

    /**
     *
     * @returns {Promise}
     */
    getReadAnswersCount() {
        return AsyncStorage.getItem('answers-count-read' + this.props.proposal.id + '-' + this.props.dialog.id)
    }

    calcBageCount() {
        // this.getAnswersCount()
        //     .then((answersCount) => {
        //         this.getReadAnswersCount()
        //             .then((readAnswersCount) => {
        //
        //                 console.log('GET DIALOG READ : ' + answersCount + ' READ ' + readAnswersCount + ' proposal ' + this.props.proposal.id + ' dialog ' + this.props.dialog.id);
        //
        //                 let value = answersCount - readAnswersCount;
        //                 if (value > 0) {
        //                     this.setState({newMessages: true, answersCount: value});
        //                 }
        //             })
        //     })
    }

    componentDidMount() {
        this.calcBageCount();
    }

    render() {


        return (
            <Shadow style={styles.blockWrapper}>
                <TouchableHighlight
                    onPress={() => DialogListItem.goToMessenger(this.props.dialog.item.id, this.props.dialog.item.name, this.props.proposal)}
                >
                    <View>
                        <Text style={[ {paddingLeft: 15}]}>{this.props.dialog.item.name}</Text>
                    </View>
                </TouchableHighlight>
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
});