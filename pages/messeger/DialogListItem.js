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
import {STORAGE_AUTH_ID} from "../../helpers/Constants";
import EventBus from "eventing-bus";
import * as ArrayHelper from "../../helpers/ArrayHelper";
import {db} from "../../Config";

export default class DialogListItem extends Component {

    state = {
        modalVisible: false,
        newMessages: false,
        answersCount: null
    };
    dialog: any;
    address: any;


    notifySubscribe;
    notifyReadSubscribe;

    messages = [];


    constructor(props) {
        super(props);
    }

    getSubscribeKey(): string {
        return 'p_' + this.props.proposal.id + 'o_' + this.props.dialog.item.id;
    }

    componentWillMount() {

        AS.getItem(STORAGE_AUTH_ID)
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.props.proposal.id + '/o_' + this.props.organization.id;
                let ref = db.ref(path);
                ref.once('value', (snapshot) => {
                    const value = snapshot.val();
                    this.messages = ArrayHelper.getKeys(value);

                    console.log('init messages', this.messages);

                })
            });


        console.log('subscribe', this.getSubscribeKey());

        this.notifySubscribe = EventBus.on(this.getSubscribeKey(), (val) => {
            this.setState({newMessages: true});
        });

        this.notifyReadSubscribe = EventBus.on(this.getSubscribeKey() + 'read', () => {
            this.setState({newMessages: false});
        });
    }

    componentWillUnmount(): void {
        this.notifySubscribe();
        this.notifyReadSubscribe();
    }

    goToMessenger(organization: Organization, proposal) {
        Actions.Messenger({
            organization: organization,
            proposal: proposal,
            subscribeHandler: this.subscribeHandler
        });
    }

    componentDidMount() {
        AS.getItem('p_' + this.props.proposal.id + 'o_' + this.props.dialog.item.id).then((data) => {
            let count = parseInt(data);
            if (this.props.proposal.messages > count || isNaN(count)) {
                this.setState({newMessages: true});
            }
        })
    }

    render() {
        const image = this.props.dialog.item.images[0];
        return (
            <Shadow style={styles.blockWrapper}>
                <NewMessagesNotify newMessages={this.state.newMessages}/>
                <TouchableOpacity
                    onPress={() => this.goToMessenger(this.props.dialog.item, this.props.proposal)}
                >
                    <View style={styles.adItem}>
                        <View style={[styles.imageWrapper, {flex: 0.3}]}>
                            <Image style={styles.image} source={{uri: image}} resizeMode="cover"/>
                        </View>
                        <View style={[styles.itemAnnotation, {padding: 10, flex: 0.6}]}>
                            <View style={{marginBottom: 5}}>
                                <Text style={[textStyle.boldFont, {fontSize: 15, lineHeight: 18}]}>
                                    {this.props.dialog.item.name}
                                </Text>
                            </View>
                            <View style={{marginBottom: 5}}>
                                <Text
                                    style={[textStyle.defaultFont, {fontSize: 13, lineHeight: 16}]}>
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
                                        <Text style={[textStyle.boldFont, {fontSize: 15, lineHeight: 18}]}>
                                            {formatCost(this.props.proposal.amount * this.props.proposal.guests_count)}
                                        </Text>
                                        <Text style={[textStyle.boldFont, {fontSize: 15, lineHeight: 18}]}>
                                            &nbsp;{"\u20bd"}
                                        </Text>
                                    </Text>
                                </Text>
                            </View>
                            <View style={{marginBottom: 6}}>
                                <Profit profit={this.props.dialog.item.profit}/>
                            </View>
                            <View>
                                <Text>{round10(this.props.dialog.item.minPrice / this.props.proposal.guests_count)} {"\u20bd"} /
                                    чел.</Text>
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
            28: {},
            default: {}
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
            ios: {},
            android: {
                paddingTop: 5
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
