import React, {Component} from "react";
import {AsyncStorage, Image, ListView, Share, View, Text} from "react-native";
import Config, {db} from '../../Config';
import Loading from "../Loading";
import MessageForm from './MessageForm'
import moment from "moment";
import Hyperlink from 'react-native-hyperlink'

import CacheStore from "react-native-cache-store";
import * as ArrayHelper from "../../helpers/ArrayHelper";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from "../../styles/Global";

export default class Messenger extends Component {

    cacheKey = '';

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            listTitle: '',
            loaded: false,
        };

        this.dialogId = this.props.dialogId;
        this.proposalId = this.props.proposal.id;
        this.organizationName = this.props.organizationName;

        this.cacheKey = 'cache-messages-' + this.proposalId + '-o_' + this.dialogId;
    }

    static decodeMessage(message) {
        return  message; // JSON.parse(message);
    }

    static myMessage(model) {
        return (
            <View>
                        <View>
                            <Text>{model.message}</Text>
                            {this.renderTime(model.created_at)}
                        </View>
            </View>
        );
    }

    static shareMessage(message) {
        Share.share({
            message: message,
            title: 'Поделиться с другом'
        }, {
            // Android only:
            dialogTitle: 'Поделиться с другом',
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    }

    static foreignMessage(model) {
        return (
            <View>
                    <View size={12}
                         onPress={() => Messenger.shareMessage(model.message)}
                         >
                        <View>
                            <Hyperlink linkDefault={true}>
                                <Text>{model.message}</Text>
                            </Hyperlink>
                            {this.renderTimeWithShare(model.created_at)}
                        </View>
                    </View>
            </View>
        );
    }

    static isMy(model) {
        return model.author_class === 'app\\common\\models\\MobileUser';
    }

    static renderTimeWithShare(timestamp) {
        const time = moment(timestamp * 1000);
        return (
            <View>
                <Text >
                    <Text>{time.format('DD.MM.YYYY HH:mm')}
                    </Text>&nbsp;&nbsp;&nbsp;&nbsp;

                </Text>
            </View>
        )
    }

    static renderTime(timestamp) {
        const time = moment(timestamp * 1000);
        return (
            <Text>{time.format('DD.MM.YYYY HH:mm')}</Text>
        )
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.proposalId;
                db.ref(path).off()

            });
    }

    /**
     * fetch data from API
     */
    fetchData() {

        CacheStore.get(this.cacheKey).then((value) => {
            if (value !== null) {
                value = JSON.parse(value);
                this.updateList(value);
            }
        });

        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.proposalId + '/';


                console.log('firebase path',path);

                let ref = db.ref(path);

                ref.once('value', snapshot => {console.log("snapshot value", snapshot)});

                console.log('ref', ref);

                ref.on('value', (snapshot) => {
                        const value = snapshot.val();

                        console.log('snapshot', value);

                        if (value['o_' + this.dialogId]) {

                            const items = value['o_' + this.dialogId];

                            this.updateList(items);
                            AsyncStorage.setItem(this.cacheKey, JSON.stringify(items));


                            let length = 0;
                            const orgs = ArrayHelper.getKeys(value);
                            orgs.forEach((organizationId) => {
                                length += ArrayHelper.getKeys(value[organizationId]).length;
                            });

                            AsyncStorage.getItem('answers-count-read' + this.proposalId)
                                .then((value) => {

                                    let acr = value == null ? length : value + length;

                                    console.log('SET READ PROPOSAL ' + acr);

                                    AsyncStorage.setItem('answers-count-read' + this.props.proposal.id, acr.toString());
                                });

                            console.log('SET DIALOG READ ' + length + ' proposal ' + this.props.proposal.id + ' dialog ' + this.dialogId);

                            AsyncStorage.setItem('answers-count-read' + this.props.proposal.id + '-' + this.dialogId, length.toString());
                            Actions.refresh();
                        }
                    })
            });
    }

    updateList(items) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items),
            loaded: true,
        });

        const length = ArrayHelper.getKeys(items).length;
        CacheStore.set('answers-count-read' + this.proposalId + '-' + this.dialogId, length, Config.lowCache);


    }

    render() {

        console.log("STATE ", this.state.loaded);

        if (!this.state.loaded) {
            return (

                <View style={textStyle.rootView}>
                        <Loading/>
                    </View>
            );
        }

        return (

            <View style={textStyle.rootView}>
                    <View>
                        <Text style={{
                            marginLeft: 15,
                            color: '#fff'
                        }}>{this.props.proposal.date} на {this.props.proposal.guests_count} человека</Text>
                    </View>
                    <View>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderMessage}
                        />
                    </View>
                    <MessageForm proposalId={this.proposalId} organizationId={this.dialogId}/>
                </View>
        );
    }

    renderMessage(message, sectionID, rowID) {

        console.log(message);


        const decodedMessage = Messenger.decodeMessage(message);
        const render = Messenger.isMy(decodedMessage) ? Messenger.myMessage(decodedMessage) : Messenger.foreignMessage(decodedMessage);
        return (render);
    }

}