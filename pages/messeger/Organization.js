import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import {formatCost, trunc} from "../../helpers/StringHelper";
import Rating from "../../components/Rating";
import Profit from "../../components/Profit";
import {Actions} from "react-native-router-flux";

export default class Organization extends React.Component {

    render() {
        const image = this.props.organization.images[0];
        return (
            <TouchableOpacity
                style={styles.blockWrapper}
                onPress={() => {
                    Actions.RestaurantCard({restaurant: this.props.organization})
                }}
            >
                <View style={{flexDirection: 'column'}}>
                    <Image style={styles.image} source={{uri: image}} resizeMode="cover"/>
                </View>
                <View style={{flex: 1, flexDirection: 'column', paddingLeft: 15}}>
                    <View>
                        <Text style={[textStyle.boldFont, {fontSize:15, lineHeight:18, paddingTop: 10}]}>
                            {this.props.organization.name}
                        </Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text
                            style={[textStyle.defaultFont, {
                                fontSize: 13,
                                lineHeight:16,
                                color: '#0C21E2'
                            }]}>
                            {this.props.organization.address}
                        </Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text
                            style={[textStyle.defaultFont, {
                                fontSize: 13,
                                lineHeight:16,
                                color: '#0C21E2'
                            }]}>
                            {this.props.organization.phone}
                        </Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Rating rating={this.props.organization.rating}/>
                    </View>
                </View>
                <View style={{flex: .5, flexDirection: 'column', alignItems: 'flex-end', paddingRight: 10}}>
                    <View style={{paddingTop: 10}}>
                        <Text style={{flexWrap: 'nowrap'}}>
                            <Text>
                                <Text style={[textStyle.boldFont, {fontSize:15, lineHeight:18}]}>
                                    {formatCost(this.props.proposal.amount * this.props.proposal.guests_count)}
                                </Text>
                                <Text style={{fontSize:15, lineHeight:18}}>
                                    &nbsp;{"\u20bd"}
                                </Text>
                            </Text>
                        </Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Profit profit={this.props.organization.profit}/>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    blockWrapper: {
        borderColor: '#E0E0E0',
        borderBottomWidth: 1,
        elevation: 0,
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%'
    },
    adItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'green'
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
        width: 65, //'100%',
        height: 120,// '100%'
    },
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
});