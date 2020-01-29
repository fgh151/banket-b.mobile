import React from 'react';

import {
    Image,
    ImageBackground,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Swiper from 'react-native-swiper';
import Rating from "../../components/Rating";
import openMap from 'react-native-open-maps';
import BackButton from "../../components/BackButton";
import {Styles, windowPadding} from '../../styles/Global';
import {isEmpty} from "../../helpers/ArrayHelper";
import {ifIphoneX} from "react-native-iphone-x-helper";
import log from "../../helpers/firebaseAnalytic";
import CardItem from "./CardItem";
import ContactItem from "./ContactItem";

// const org = {
//     "id": 1,
//     "name": "Ресторанный рейтинг",
//     "contact": "Владимир",
//     "phone": "+7 (495) 788-06-00",
//     "email": "pr7880600@gmail.com",
//     "address": "Москва Славянская площадь 2/3",
//     "images": ["https://banket-b.ru/upload/organization/1/1.png", "https://banket-b.ru/upload/organization/1/2.jpg", "https://banket-b.ru/upload/organization/1/521696c0_1.jpg", "https://banket-b.ru/upload/organization/1/33458f80_1.jpg", "https://banket-b.ru/upload/organization/1/ab6d6aa6_1.jpg"],
//     "halls": [
//         {"title": "VIP", "size": 10000},
//         {"title": "Общий", "size": 200}
//     ],
//     "metro": [{"id": 58, "title": "Китай-город", "color": "F07E24"}, {
//         "id": 166,
//         "title": "Китай-город",
//         "color": "943E90"
//     }, {"id": 186, "title": "Киевская", "color": "915133"}],
//     "key": "1",
//     "rating": 10,
//     "tripadvisor_url": "http://ya.ru",
//     "description": "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test "
// };

export default function RestaurantCard(props) {
    this.restaurant = props.restaurant;

    // console.log(this.restaurant );

    log(this, 'render', {restaurant: this.restaurant.name});
    return (
        <ScrollView>
            <View style={local.wrapper}>
                <StatusBar barStyle="light-content"/>
                <View style={{flex: 30, height: 250}}>
                    <Swiper
                        loop={true}
                        showsButtons={false}
                        style={{backgroundColor: '#ccc'}}
                        activeDot={<View style={local.sliderActiveDot}/>}
                        dot={<View style={local.dotStyle}/>}
                        scrollsToTop={true}
                        paginationStyle={{position: 'absolute', top: -100}}
                    >
                        {renderSlider(this.restaurant.images)}
                    </Swiper>
                    <ImageBackground resizeMode={'stretch'} style={local.gradient}
                                     source={require('../../assets/images/gradient.png')}/>
                    <BackButton style={local.backButton} image={'white'}/>
                </View>
                <View style={{flex: 70}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomColor: '#e0e0e0',
                        borderBottomWidth: 1
                    }}>
                        <View style={{padding: windowPadding}}>
                            <Text style={Styles.boldFont}>
                                {this.restaurant.name}
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: windowPadding,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 5
                            }}>
                            <Rating rating={this.restaurant.rating}/>
                        </View>
                    </View>

                    <ContactItem>
                        <TouchableOpacity onPress={() => {
                            openMap({
                                latitude: this.restaurant.latitude,
                                longitude: this.restaurant.longitude
                            });
                        }} style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Text style={{color: '#1711E8'}}>
                                {this.restaurant.address}
                            </Text>
                        </TouchableOpacity>
                    </ContactItem>
                    <ContactItem>
                        <TouchableOpacity onPress={() => callNumber(this.restaurant.phone)}>
                            <Text style={{color: '#1711E8'}}>{this.restaurant.phone}</Text>
                        </TouchableOpacity>
                    </ContactItem>
                    {this.restaurant.tripadvisor_url ?
                        <ContactItem>
                            <TouchableOpacity onPress={() => openInBrowser(this.restaurant.tripadvisor_url)}>
                                <Text style={{color: '#1711E8'}}>TripAdvisor</Text>
                            </TouchableOpacity>
                        </ContactItem>
                        : null}
                    {renderHalls(this.restaurant)}
                    {renderDescription(this.restaurant)}
                </View>
            </View>
        </ScrollView>
    )
}

function openInBrowser(url) {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        }
    });
}

function callNumber(phone) {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    } else {
        phoneNumber = `tel:${phone}`;
    }

    Linking.canOpenURL(phoneNumber).then(supported => {
        if (supported) {
            return Linking.openURL(phoneNumber);
        }
    }).catch(err => console.error('An error occurred', err));
}

function renderSlider(images) {
    return images.map(function (image, i) {
        return (
            <View style={{flex: 1}} key={i}>
                <Image source={{uri: image}} style={{width: '100%', height: 300}}/>
            </View>
        );
    });
}

function renderDescription(restaurant) {
    if (restaurant.description !== '' && restaurant.description !== null) {
        return <CardItem title={'Описание'} content={<Text>{restaurant.description}</Text>}/>
    }
    return null;
}

function renderHalls(restaurant) {
    if (isEmpty(restaurant)) {
        return null;
    }
    return (

        <CardItem
            title={'Залы'}
            content={restaurant.halls.map((hall, index) => (
                <View style={{flexDirection: 'row', marginBottom: 5}} key={index}>
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <Text style={{fontSize: 15, lineHeight: 18}}>{hall.title}</Text>
                    </View>
                    <View style={{flex: 2, alignSelf: 'stretch'}}>
                        <Text style={{fontSize: 15, lineHeight: 18}}>{hall.size} человек</Text>
                    </View>
                </View>
            ))}
        />
    )
}

const local = StyleSheet.create({
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    gradient: {
        height: 60,
        width: '100%',
        // backgroundColor:'green',
        position: 'absolute',
        top: 0,
        left: 0
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 0,
        ...ifIphoneX({
            top: 40,
        }),
        ...Platform.select({
            ios: {
                top: 19,

            },
            android: {
                top: 10,
            },
        }),
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        padding: 0,
        justifyContent: 'flex-start'
    },
    slideItem: {
        height: 352,
        width: '100%',
        backgroundColor: 'green'
    },
    sliderActiveDot: {
        backgroundColor: '#ffffff',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4,
        ...Platform.select({
            ios: {
                top: -4,

            },
            android: {},
        }),
    },
    dotStyle: {
        backgroundColor: 'transparent',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4,
        borderColor: '#ffffff',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                top: -4,

            },
            android: {},
        }),
    }
});
