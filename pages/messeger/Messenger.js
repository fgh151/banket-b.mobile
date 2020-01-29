import React, {Component} from "react";
import {FlatList, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import AS from '@react-native-community/async-storage'
import {db} from '../../Config';
import Loading from "../Loading";
import MessageForm from './MessageForm'
import * as ArrayHelper from "../../helpers/ArrayHelper";
import {messagesObject2array} from "../../helpers/ArrayHelper";
import {Styles as textStyle} from "../../styles/Global";
import Organization from "./Organization";
import MessageWrapper from "./MessageWrapper";
import EventBus from "eventing-bus";
import {STORAGE_AUTH_ID} from "../../helpers/Constants";
import {Notify} from "../../helpers/Notify";
import log from "../../helpers/firebaseAnalytic";


export default class Messenger extends Component {
    cacheKey = '';
    previusMessage = null;

    isUpdating = false;
    needUpdate = false;

    eventListener;

    messagesCount = 0;

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            listTitle: '',
            loaded: true,
            inputActive: false
        };
        this.cacheKey = 'cache-messages-' + this.props.proposal.id + '-o_' + this.props.organization.id;
        this.toggleInputActive = this.toggleInputActive.bind(this);
    }

    static isMy(model) {
        return model.author_class === 'app\\common\\models\\MobileUser';
    }

    componentDidMount() {
        AS.getItem(STORAGE_AUTH_ID)
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.props.proposal.id + '/o_' + this.props.organization.id;
                let ref = db.ref(path);
                ref.on('value', (snapshot) => {
                    const value = snapshot.val();
                    this.updateList(value);
                })
            });
    }

    componentWillMount() {
        this.eventListener = EventBus.on('p_' + this.props.proposal.id + 'o_' + this.props.organization.id, (val) => {
            let count = ArrayHelper.getKeys(val).length;
            if (count !== this.messagesCount && val !== undefined) {
                this.updateList(val);
                this.messagesCount = count;
            }
        })
    }

    componentWillUnmount() {
        this.eventListener();
        Notify.readAllMessages('p_' + this.props.proposal.id, 'o_' + this.props.organization.id, ArrayHelper.getKeys(this.state.items).length);
    }

    updateList(items) {
        if (!this.isUpdating) {
            this.isUpdating = true;
            this.setState({items: items, loaded: true,}, () => {
                this.scroll(true);
                this.isUpdating = false;


                if (this.needUpdate !== false) {
                    this.updateList(this.needUpdate);
                    this.needUpdate = false;
                }
            });
        } else {
            this.needUpdate = items;
        }
    }

    toggleInputActive() {
        this.setState({inputActive: !this.state.inputActive});
        this.scroll();
    }

    scroll(animated = false) {
        this.flatList.scrollToOffset({offset: 0, animated: animated});
    }

    renderOrganization() {
        if (!this.state.inputActive) {
            return <Organization organization={this.props.organization} proposal={this.props.proposal}/>
        }
        return null;
    }

    render() {
        log(this, 'render');
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
                    onContentSizeChange={() => this.scroll()}
                    onLayout={() => this.scroll()}
                    style={style.list}
                    contentContainerStyle={style.messagesContainer}
                    data={messages.reverse()}
                    renderItem={(item) => this.renderMessage(item)}
                    inverted={true}
                />
                <MessageForm
                    onToggle={this.toggleInputActive}
                    proposalId={this.props.proposal.id}
                    organizationId={this.props.organization.id}
                />
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

    renderMessage(listItem) {
        let message = listItem.item;
        let isMy = Messenger.isMy(message);

        return <MessageWrapper
            model={message}
            bubbleColor={isMy ? '#DFEAFF' : '#F6F6F6'}
            align={isMy ? 'flex-end' : 'flex-start'}
            share={!isMy}
            same={this.isSenderSame(message)}
        />
    }
}

const style = StyleSheet.create({
    list: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        padding: 10,
        transform: [{scaleY: -1}]
    },
    messagesContainer: {
        justifyContent: 'center'
    },
    wrapper: {
        margin: 0,
        ...Platform.select({
            ios: {},
            android: {
                padding: 0,
                justifyContent: 'space-between',
            },
        }),
    }
});
