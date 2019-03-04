import React from 'react';

import {Image, Linking, StyleSheet, Text, TouchableOpacity, View, ImageBackground} from 'react-native';
import Swiper from 'react-native-swiper';
import Rating from "../components/Rating";
import openMap from 'react-native-open-maps';
import BackButton from "../components/BackButton";
import {Styles} from '../styles/Global';


export default class RestaurantCard extends React.Component {

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
                    <BackButton style={{position:'absolute', top:0, left:0}} image={'white'}/>
                </View>
                <View style={{flex:70}}>
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
                        <View style={{padding: 15, justifyContent:'center', alignItems: 'center'}}>
                            <Rating rating={this.props.restaurant.rating}/>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', padding: 15}}>

                        <View>
                            <Text>
                                {this.props.restaurant.address}
                            </Text>
                            <TouchableOpacity onPress={() => this.callNumber('79778069428')}>
                                <Text>{this.props.restaurant.phone}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => {
                            openMap({latitude: this.props.restaurant.latitude, longitude: this.props.restaurant.longitude});
                        }} style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                            <ImageBackground
                                source={require('../assets/images/geo_point.png')}
                                style={{

                                    flex:0,

                                    alignSelf: 'center',
                                }}
                                resizeMode="stretch"
                            >
                                <View style={{height:20, width:15}}/>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
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