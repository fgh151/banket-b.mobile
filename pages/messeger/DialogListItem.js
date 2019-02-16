import React, {Component} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import Shadow from "../../components/Shadow";
import {Styles as textStyle} from "../../styles/Global";
import {formatCost, trunc} from "../../helpers/StringHelper";

import Rating from '../../components/Rating';
import type {Organization} from "../../types/Organization";
import Profit from "../../components/Profit";

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

    static goToMessenger(organization: Organization, proposal) {
        Actions.Messenger({
            organization: organization,
            proposal: proposal
        });
    }

    componentDidMount() {
    }

    render() {
        const image = this.props.dialog.item.images[0];

        console.log('ITEM', this.props.dialog.item);

        return (
            <Shadow style={styles.blockWrapper}>
                <TouchableOpacity
                    onPress={() => DialogListItem.goToMessenger(this.props.dialog.item, this.props.proposal)}
                >
                    <View style={styles.adItem}>
                        <View style={[styles.imageWrapper, {flex: 0.3}]}>
                            <Image style={styles.image} source={{uri: image}} resizeMode="cover"/>
                        </View>
                        <View style={[styles.itemAnnotation, {padding: 10, flex: 0.5}]}>
                            <View>
                                <Text style={textStyle.boldFont}>
                                    {this.props.dialog.item.name}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[textStyle.defaultFont, {fontSize: 10}]}>{trunc(this.props.dialog.item.address, 15)}</Text>
                            </View>
                            <View>
                                <Rating rating={this.props.dialog.item.rating}/>
                            </View>
                        </View>
                        <View style={[styles.itemAnnotation, {
                            paddingTop: 10,
                            paddingRight: 10,
                            flex: 0.5,
                            alignItems: 'flex-end'
                        }]}>
                            <View>
                                <Text>
                                    <Profit profit={this.props.dialog.item.profit}/>
                                    <Text>
                                        <Text style={textStyle.boldFont}>
                                            {formatCost(this.props.proposal.amount * this.props.proposal.guests_count)}
                                        </Text>
                                        <Text>
                                            &nbsp;{"\u20bd"}
                                        </Text>
                                    </Text>
                                </Text>
                            </View>
                            <View>
                                <Text>{formatCost(this.props.proposal.amount)} {"\u20bd"} / чел</Text>
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
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginTop: 10,
        marginBottom: 1,
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
        // height:100
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
});