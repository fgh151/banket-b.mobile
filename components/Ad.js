import {FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Client from "../http/Client";
import Config from '../Config'
import CacheStore from "react-native-cache-store";
import {Styles as textStyle, windowPadding} from "../styles/Global";
import Shadow from './Shadow'

export default class Ad extends React.Component {

    categories = [];

    debug = false; //__DEV__;

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
        };
    }

    componentDidMount() {
        if (this.debug !== true) {
            this.fetchData();
        }
    }

    fetchData(url = '/promo/list') {
        const CACHE_KEY = 'promo-categories';
        const api = new Client();
        api.GET(url)
            .then(
                (responseData) => {
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
        if (this.state.items.length > 0 && this.debug !== true) {
            return (
                <View style={[style.block, this.props.style]}>
                    <View>
                        <Text style={[textStyle.defaultFont, {fontSize: 15, lineHeight: 18, color: 'rgba(0,0,0,0.5)'}]}>
                            Предложения от партнеров
                        </Text>
                    </View>
                    <FlatList
                        style={{marginTop: 0, marginLeft: -10}}
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
            <Shadow>
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
                            <View style={{marginBottom: 8, marginTop: 8}}>
                                <Text style={style.organizationName}>
                                    {promo.item.organizationName}
                                </Text>
                            </View>
                            <View style={{marginBottom: 10, marginRight: 5}}>
                                <Text style={style.promoText}>{promo.item.title}</Text>
                            </View>
                            <View style={{marginBottom: 8, position: 'absolute', bottom: 0, left: 0}}>
                                <Text style={[textStyle.defaultFont, {
                                    color: 'rgba(0, 0, 0, 0.5)',
                                    fontSize: 13,
                                    lineHeight: 16
                                }]}>Подробнее</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Shadow>
        );
    }

}

const style = StyleSheet.create({
    block: {
        height: 180,
        marginRight: -windowPadding,

    },
    wrapper: {
        height: 118,
        width: 286,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    adItem: {
        flex: 1,
        flexDirection: 'row',
        width: 286,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    adItemAnnotation: {
        flex: 1,
        flexDirection: 'column',
        borderTopRightRadius: 5,
        justifyContent: 'flex-start',
        width: 200,
    },
    imageWrapper: {
        flex: .6,
        overflow: 'hidden',
        borderTopLeftRadius: 5,
    },
    image: {
        width: 91,
        height: 118,
    },
    organizationName: {
        fontFamily: "Lato-Bold",
        fontSize: 13,
        lineHeight: 16,
        color: '#000000',
    },
    promoText: {
        fontFamily: "Lato-Regular",
        fontSize: 13,
        lineHeight: 16,
        color: '#000000',

    }
});