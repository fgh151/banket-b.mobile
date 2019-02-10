import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import {formatCost, trunc} from "../../helpers/StringHelper";
import Rating from "../../components/Rating";
import Profit from "../../components/Profit";


export default class Organization extends React.Component {

    render() {

        console.log(this.props.organization);
        console.log(this.props.proposal);

        const image = this.props.organization.images[0];
        console.log(image);
        return (
            <View style={styles.blockWrapper}>
                <TouchableOpacity
                    onPress={() => {
                    }}
                >
                    <View style={styles.adItem}>

                        <View style={{ flexDirection: 'column'}}>
                            <Image style={styles.image} source={{uri: image}} resizeMode="cover"/>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', paddingLeft: 10}}>
                            <View>
                                <Text style={textStyle.boldFont}>
                                    {this.props.organization.name}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[textStyle.defaultFont, {fontSize: 10, color: '#0C21E2'}]}>{trunc(this.props.organization.address, 15)}</Text>
                            </View>
                            <View>
                                <Text
                                    style={[textStyle.defaultFont, {fontSize: 10, color: '#0C21E2'}]}>{trunc(this.props.organization.phone, 15)}</Text>
                            </View>
                            <View>
                                <Rating rating={this.props.organization.rating}/>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end', paddingRight: 10}}>

                            <View>
                                <Text style={{flexWrap: 'nowrap'}}>
                                    <Profit profit={this.props.organization.profit}/>
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

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    blockWrapper: {
        borderColor: '#E0E0E0',
        elevation: 0,
        flexDirection: 'column',
        // flex: 1,
        marginRight: -15,
        marginLeft: -15,
        marginTop: -15,


    },
    adItem: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',

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
        width: 100, //'100%',
        height: 100,// '100%'
    },
    profit: {
        fontFamily: "Lato-Bold",
        color: '#00D800'
    },
});