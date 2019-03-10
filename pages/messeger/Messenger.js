import React, {Component} from "react";
import {AsyncStorage, FlatList, Share, Text, View, TouchableOpacity} from "react-native";
import Config, {db} from '../../Config';
import Loading from "../Loading";
import MessageForm from './MessageForm'
import moment from "moment";
import Hyperlink from 'react-native-hyperlink'
import CacheStore from "react-native-cache-store";
import * as ArrayHelper from "../../helpers/ArrayHelper";
import {messagesObject2array} from "../../helpers/ArrayHelper";
import {Styles as textStyle} from "../../styles/Global";
import {updateProposalList} from "../BattleList/ProposalListItem";
import Organization from "./Organization";

export default class Messenger extends Component {

    cacheKey = '';

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            listTitle: '',
            loaded: false,

            inputActive: false
        };

        this.cacheKey = 'cache-messages-' + this.props.proposal.id + '-o_' + this.props.organization.id;

        this.toggleInputActive = this.toggleInputActive.bind(this);
    }

    static myMessage(model) {
        return (
            <View style={{paddingRight: 10, paddingBottom: 10, paddingTop: 10, alignItems: 'flex-end'}}>
                <View
                    style={{
                        borderRadius: 15,
                        backgroundColor: '#DFEAFF',
                        flex: 1,
                        flexDirection: 'column',
                        maxWidth: '90%',
                        padding: 10
                    }}
                >
                    <View style={{ flex:95}}>
                        <Hyperlink linkDefault={true}>
                            <Text>{model.message}</Text>
                        </Hyperlink>
                    </View>
                    <View  style={{flex:5}}>
                        {this.renderTime(model.created_at, 'right')}
                    </View>
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
            <View style={{paddingRight: 10, paddingBottom: 10, paddingTop: 10, alignItems: 'flex-start'}}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        backgroundColor: '#F6F6F6',
                        flex: 1,
                        flexDirection: 'column',
                        maxWidth: '90%',
                        padding: 10,

                    }}
                    onPress={() => Messenger.shareMessage(model.message)}
                >
                    <View style={{ flex:95}}>
                        <Hyperlink linkDefault={true}>
                            <Text>{model.message}</Text>
                        </Hyperlink>
                    </View>
                    <View style={{ flex:5}}>
                        {this.renderTime(model.created_at, 'right')}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    static isMy(model) {
        return model.author_class === 'app\\common\\models\\MobileUser';
    }

    static renderTime(timestamp, align) {
        const time = moment(timestamp * 1000);
        return (
            <Text style={{paddingTop: 10, textAlign: align}}>{time.format('HH:mm')}</Text>
        )
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.props.proposal.id + '/o_' + this.props.organization.id;
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
                const path = '/proposal_2/u_' + id + '/p_' + this.props.proposal.id + '/o_' + this.props.organization.id;


                let ref = db.ref(path);


                ref.on('value', (snapshot) => {
                    const value = snapshot.val();


                    this.updateList(value);
                    AsyncStorage.setItem(this.cacheKey, JSON.stringify(value));
                    const messages = ArrayHelper.getKeys(value);
                    let count = 0;
                    messages.forEach((messageTime) => {

                        let message = value[messageTime];
                        if (message.author_class === 'app\\common\\models\\Organization') {
                            count++;
                        }
                    });

                    AsyncStorage.getItem('answers-count-read' + this.props.proposal.id)
                        .then((value) => {

                            let acr = value == null ? count : parseInt(value) + count;

                            AsyncStorage.setItem('answers-count-read' + this.props.proposal.id, acr.toString());
                        });
                    updateProposalList();
                })
            });
    }

    updateList(items) {
        this.setState({
            items: items,
            loaded: true,
        });

        const length = ArrayHelper.getKeys(items).length;
        CacheStore.set('answers-count-read' + this.props.proposal.id + '-' + this.props.organization.id, length, Config.lowCache);


    }

    toggleInputActive() {
        this.setState({inputActive: !this.state.inputActive})
    }

    renderOrganization() {
        if (!this.state.inputActive) {
            return <Organization organization={this.props.organization} proposal={this.props.proposal}/>
        }
        return null;
    }

    render() {

        if (!this.state.loaded) {
            return (

                <View style={textStyle.rootViewWrapper}>
                    <Loading/>
                </View>
            );
        }

        let messages = messagesObject2array(this.state.items);

        return (

            <View style={[textStyle.rootViewWrapper, {margin: -15 }]}>
                {this.renderOrganization()}
                <FlatList
                    style={{flex: 1, flexDirection: 'column', width:'100%', padding: 10}}
                    data={messages}
                    renderItem={(item) => this.renderMessage(item)}
                />
                <MessageForm onToggle={this.toggleInputActive} proposalId={this.props.proposal.id} organizationId={this.props.organization.id}/>
            </View>
        );
    }

    renderMessage(listItem) {
        var message = listItem.item;
        const render = Messenger.isMy(message) ? Messenger.myMessage(message) : Messenger.foreignMessage(message);
        return (render);
    }

}