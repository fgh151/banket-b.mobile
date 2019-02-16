import {FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Client from "../http/Client";

import Config from '../Config'
import CacheStore from "react-native-cache-store";
import {Styles as textStyle} from "../styles/Global";

export default class Ad extends React.Component {

    categories = [];

    constructor(props) {
        super(props);
        this.state = {

            items: [],

            loaded: false,
        };
    }

    componentDidMount() {

        if (__DEV__ !== true) {

            this.fetchData();
        }
    }

    fetchData(url = '/promo/list') {
        const CACHE_KEY = 'promo-categories';
        const api = new Client();
        api.GET(url)
            .then(
                (responseData) => {

                    console.log(responseData);

                    this.setState({
                        items: responseData,
                        loaded: true,
                    });
                }
            );

        CacheStore.get(CACHE_KEY).then((value) => {
            if (value !== null) {
                this.categories = value;
            } else {
                api.GET('/promo/activity')
                    .then(
                        (responseData) => {
                            this.categories = responseData;
                            CacheStore.set(CACHE_KEY, responseData, Config.highCache);
                        }
                    );
            }
        });
    }

    render() {
        if (this.state.items.length > 0 && __DEV__ !== true) {
            return (
                <View style={[style.block, this.props.style]}>
                    <Text style={textStyle.defaultFont}>Предложения от партнеров</Text>

                    <FlatList
                        style={{marginTop: 10}}
                        horizontal={true}
                        renderItem={this.renderListItem}
                        data={this.state.items}
                    />
                </View>
            );
        } else {
            return null;
        }
    }

    renderListItem(promo) {
        const image = Config.cabinetUrl + promo.item.image;
        const url = Config.apiUrl + '/promo/redirect/' + promo.item.id;

        return (
            <TouchableOpacity
                style={style.wrapper}
                elevation={5}
                onPress={() => Linking.openURL(url)}
            >
                <View style={style.adItem}>
                    <View style={style.imageWrapper}>
                        <Image style={style.image} source={{uri: image}} resizeMode="cover"/>
                    </View>
                    <View style={style.adItemAnnotation}>
                        <View>
                            <Text style={style.organizationName}>
                                {promo.item.organizationName}
                            </Text>
                        </View>
                        <View>
                            <Text style={style.promoText}>{promo.item.title}</Text>
                        </View>
                        <View>
                            <Text style={textStyle.defaultFont}>Подробнее</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}

const style = StyleSheet.create({
    block: {
        height: 153,
        marginRight: -15
    },
    wrapper: {
        height: 118,
        marginRight: 10,


        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }

    },
    adItem: {
        flex: 1,
        flexDirection: 'row',
        width: 286,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    adItemAnnotation: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        borderTopRightRadius: 5,
    },
    imageWrapper: {
        overflow: 'hidden',
        // height:100
        borderTopLeftRadius: 5,
    },
    image: {
        width: 91,
        height: 118
    },
    organizationName: {
        fontFamily: "Lato-Bold",
        fontSize: 16,
        color: '#000000'
    },
    promoText: {

        fontFamily: "Lato-Regular",
        fontSize: 14,
        color: '#000000'
    }
});