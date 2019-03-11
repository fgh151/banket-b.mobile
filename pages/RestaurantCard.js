import React from 'react';

import {Image, ImageBackground, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Swiper from 'react-native-swiper';
import Rating from "../components/Rating";
import openMap from 'react-native-open-maps';
import BackButton from "../components/BackButton";
import {Styles} from '../styles/Global';
import {isEmpty} from "../helpers/ArrayHelper";


export default class RestaurantCard extends React.PureComponent {


    //MOC
    // org = {
    //     "id": 1,
    //     "name": "Ресторанный рейтинг",
    //     "contact": "Владимир",
    //     "phone": "+7 (495) 788-06-00",
    //     "email": "pr7880600@gmail.com",
    //     "address": "Москва Славянская площадь 2/3",
    //     "images": ["https://banket-b.ru/upload/organization/1/1.png", "https://banket-b.ru/upload/organization/1/2.jpg", "https://banket-b.ru/upload/organization/1/3.jpg", "https://banket-b.ru/upload/organization/1/bfccf0d7_1.jpg"],
    //     "halls": [
    //         {"title": "VIP", "size": 10000},
    //         {"title": "Общий", "size": 200}
    //     ],
    //     "metro": [{"id": 58, "title": "Китай-город", "color": "F07E24"}, {
    //         "id": 166,
    //         "title": "Китай-город",
    //         "color": "943E90"
    //     }, {"id": 186, "title": "Киевская", "color": "915133"}],
    //     "key": "1"
    // };


    callNumber = (url) => {
        Linking.canOpenURL(`tel:${url}`).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    };

    render() {
        return (
            <View style={[local.wrapper]}>
                <View style={{flex: 30, overflow: 'hidden'}}>
                    <Swiper
                        loop={true}
                        showsButtons={false}
                        style={{flex: 1}}
                        activeDot={<View style={local.sliderActiveDot}/>}
                        dot={<View style={local.dotStyle}/>}
                        scrollsToTop={true}
                        paginationStyle={{position: 'absolute', top: -100}}
                    >
                        {this.renderSlider(this.props.restaurant.images)}
                    </Swiper>
                    <BackButton style={{position: 'absolute', top: 0, left: 0}} image={'white'}/>
                </View>
                <View style={{flex: 70}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomColor: '#e0e0e0',
                        borderBottomWidth: 1
                    }}>
                        <View style={{padding: 15}}>
                            <Text style={Styles.boldFont}>
                                {this.props.restaurant.name}
                            </Text>
                        </View>
                        <View style={{padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                            <Rating rating={this.props.restaurant.rating}/>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row', padding: 15,
                        borderBottomColor: '#e0e0e0',
                        borderBottomWidth: 1
                    }}>

                        <View>
                            <Text>
                                {this.props.restaurant.address}
                            </Text>
                            <TouchableOpacity onPress={() => this.callNumber('79778069428')}>
                                <Text>{this.props.restaurant.phone}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => {
                            openMap({
                                latitude: this.props.restaurant.latitude,
                                longitude: this.props.restaurant.longitude
                            });
                        }} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <ImageBackground
                                source={require('../assets/images/geo_point.png')}
                                style={{

                                    flex: 0,

                                    alignSelf: 'center',
                                }}
                                resizeMode="stretch"
                            >
                                <View style={{height: 20, width: 15}}/>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    {this.renderHalls()}
                </View>
            </View>
        )
    }

    renderSlider(images) {
        return images.map(function (image, i) {
            console.log(image);
            return (
                <View style={local.slideItem} key={i}>
                    <Image source={{uri: image}} style={{width: '100%', height: 300}}/>
                </View>
            );
        });
    }

    renderHalls() {
        if (isEmpty(this.props.restaurant)) {
            return null;
        }
        return (
            <View style={{
                padding: 15,
                flex:1,
                flexDirection:'column',
                justifyContent: 'flex-start'
            }}>
                <View>
                <Text style={Styles.boldFont}>Залы</Text>
                </View>
                <View style={{flex: 1, flexDirection:'column', alignSelf: 'auto', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                    {this.props.restaurant.halls.map((hall, index) => (
                        <View style={{flexDirection: 'row',height:30}} key={index}>
                            <View style={{flex: 1, alignSelf: 'stretch'}}>
                                <Text>{hall.title}</Text>
                            </View>
                            <View style={{flex: 2, alignSelf: 'stretch'}}>
                                <Text>{hall.size}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        )
    }
}

const local = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        padding: 0,
        justifyContent: 'flex-start'
    },
    slideItem: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',

        height: 352,
    },
    sliderActiveDot: {
        backgroundColor: '#ffffff',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4,
    },
    dotStyle: {
        backgroundColor: 'transparent',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4,
        borderColor: '#ffffff',
        borderWidth: 1
    }
});