import React, {Component} from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AS from '@react-native-community/async-storage'
import {Actions} from "react-native-router-flux";
import Shadow from "../../components/Shadow";
import {Styles as textStyle} from "../../styles/Global";
import {formatCost, round10} from "../../helpers/StringHelper";
import Rating from '../../components/Rating';
import type {Organization} from "../../types/Organization";
import Profit from "../../components/Profit";
import AndroidVersion from "../../helpers/AndroidVersion";
import NewMessagesNotify from "../../components/NewMessagesNotify";
import GlobalState from "../../models/GlobalState";
import EventBus from "eventing-bus";
import {NewMessageEventParams} from "../../models/NewMessageEventParams";
import {BUS_MESSAGE_READ_EVENT, BUS_NEW_MESSAGE_EVENT, STORAGE_NEW_ORGANIZATIONS_IDS} from "../../helpers/Constants";
import {getOrganizationMessagesStorageKey} from "../../helpers/Storage";

export default class DialogListItem extends Component {

    state = {
        modalVisible: false,
        newMessages: false,
        answersCount: null
    };
    dialog: any;
    address: any;


    newMessageSubscription;
    readMessageSubscription;

    constructor(props) {
        super(props);
    }

    static goToMessenger(organization: Organization, proposal) {
        Actions.Messenger({
            organization: organization,
            proposal: proposal
        });
    }

    componentDidMount() {
        AS.getItem(STORAGE_NEW_ORGANIZATIONS_IDS).then(data => {
            if (data) {
                data = JSON.parse(data);
                if (data.includes(this.props.organization.id.toString())) {
                    this.setState({newMessages: true})
                }
            }
        })
    }

    componentWillMount() {
        this.newMessageSubscription = EventBus.on(BUS_NEW_MESSAGE_EVENT, (data: NewMessageEventParams) => {
            if (parseInt(data.proposalId) === this.props.proposal.id && parseInt(data.organizationId) === this.props.dialog.item.id) {
                this.setState({newMessages: true})
            }
        });

        this.readMessageSubscription = EventBus.on(BUS_MESSAGE_READ_EVENT, (data: NewMessageEventParams) => {
            if (parseInt(data.proposalId) === this.props.proposal.id && parseInt(data.organizationId) === this.props.dialog.item.id) {
                this.setState({newMessages: false})
            }
        });

        let state = new GlobalState();

        if (state.newMessagesInDialogs.indexOf(this.props.proposal.id + '-' + this.props.dialog.item.id) !== -1) {
            console.log('there is new messages');
            this.setState({newMessages: true});
        }

        AS.getItem(getOrganizationMessagesStorageKey(this.props.proposal.id, this.props.dialog.item.id)).then((data) => {
            let count = parseInt(data);
            if (this.props.proposal.messages > count) {
                this.setState({newMessages: true});
            }
        })
    }

    componentWillUnmount() {
        this.newMessageSubscription();
        this.readMessageSubscription();
    }

    render() {
        const image = this.props.dialog.item.images[0];
        return (
            <Shadow style={styles.blockWrapper}>
                <NewMessagesNotify newMessages={this.state.newMessages}/>
                <TouchableOpacity
                    onPress={() => DialogListItem.goToMessenger(this.props.dialog.item, this.props.proposal)}
                >
                    <View style={styles.adItem}>
                        <View style={[styles.imageWrapper, {flex: 0.3}]}>
                            <Image style={styles.image} source={{uri: image}} resizeMode="cover"/>
                        </View>
                        <View style={[styles.itemAnnotation, {padding: 10, flex: 0.6}]}>
                            <View style={{marginBottom: 5}}>
                                <Text style={[textStyle.boldFont, {fontSize:15, lineHeight:18}]}>
                                    {this.props.dialog.item.name}
                                </Text>
                            </View>
                            <View style={{marginBottom: 5}}>
                                <Text
                                    style={[textStyle.defaultFont, {fontSize: 13, lineHeight:16}]}>
                                    {this.props.dialog.item.address}
                                </Text>
                            </View>
                            <View>
                                <Rating rating={this.props.dialog.item.rating}/>
                            </View>
                        </View>
                        <View style={[styles.itemAnnotation, {
                            paddingTop: 10,
                            paddingRight: 10,
                            flex: 0.4,
                            alignItems: 'flex-end'
                        }]}>
                            <View style={{marginBottom: 5}}>
                                <Text>
                                    <Text>
                                        <Text style={[textStyle.boldFont, {fontSize:15, lineHeight:18}]}>
                                            {formatCost(this.props.proposal.amount * this.props.proposal.guests_count)}
                                        </Text>
                                        <Text style={[textStyle.boldFont, {fontSize:15, lineHeight:18}]}>
                                            &nbsp;{"\u20bd"}
                                        </Text>
                                    </Text>
                                </Text>
                            </View>
                            <View style={{marginBottom:6}}>
                                <Profit profit={this.props.dialog.item.profit}/>
                            </View>
                            <View>
                                <Text>{ round10( this.props.dialog.item.minPrice / this.props.proposal.guests_count)} {"\u20bd"} / чел.</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Shadow>

        );
    }
}

const styles = StyleSheet.create({
    blockWrapper: {
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 1,
        marginRight: 11,
        marginLeft: 11,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        ...AndroidVersion.select({
            28: {
            },
            default: {
            }
        })
    },
    adItem: {
        flex: 1,
        flexDirection: 'row',
    },
    itemAnnotation: {
        flexDirection: 'column',
    },
    imageWrapper: {
        overflow: 'hidden',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        ...Platform.select({
            ios: {
            },
            android: {
                paddingTop:5
            },
        }),
        ...AndroidVersion.select({
            '>=26': {
                width: 'auto',
                height: 'auto',
            },
            default: {
                width: '100%',
                height: '100%',
            }
        })
    },
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
});