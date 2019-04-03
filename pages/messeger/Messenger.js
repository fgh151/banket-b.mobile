import React, {Component} from "react";
import {AsyncStorage, FlatList, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import Config, {db} from '../../Config';
import Loading from "../Loading";
import MessageForm from './MessageForm'
import CacheStore from "react-native-cache-store";
import * as ArrayHelper from "../../helpers/ArrayHelper";
import {messagesObject2array} from "../../helpers/ArrayHelper";
import {Styles as textStyle} from "../../styles/Global";
import {updateProposalList} from "../BattleList/ProposalListItem";
import Organization from "./Organization";
import MessageWrapper from "./MessageWrapper";

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

    static isMy(model) {
        return model.author_class === 'app\\common\\models\\MobileUser';
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

    previusMessage = null;

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

            <SafeAreaView style={[textStyle.rootViewWrapper, style.wrapper]}>
                {this.renderOrganization()}
                <FlatList
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
                    onLayout={() => this.flatList.scrollToEnd({animated: true})}


                    style={{flex: 1, flexDirection: 'column', width: '100%', padding: 10}}
                    data={messages.reverse()}
                    renderItem={(item) => this.renderMessage(item)}
                    inverted={true}
                />
                <MessageForm onToggle={this.toggleInputActive} proposalId={this.props.proposal.id}
                             organizationId={this.props.organization.id}/>
            </SafeAreaView>
        );
    }

    isSenderSame(message) {
        if (this.previusMessage === null) {
            this.previusMessage = message;
            return false
        }
        let result = this.previusMessage.author_class === message.author_class;
        this.previusMessage = message;
        return result;
    }

    renderMessage(listItem, index) {
        var message = listItem.item;
        return Messenger.isMy(message) ?
            <MessageWrapper model={message} bubbleColor={'#DFEAFF'} align={'flex-end'} share={false}
                            same={this.isSenderSame(message)}/>
            :
            <MessageWrapper model={message} bubbleColor={'#F6F6F6'} align={'flex-start'} share={true}
                            same={this.isSenderSame(message)}/>
    }
}

const style = StyleSheet.create({
    wrapper: {
        margin: 0,
        ...Platform.select({
            ios: {},
            android: {
                padding: 0
            },
        }),
    }
});