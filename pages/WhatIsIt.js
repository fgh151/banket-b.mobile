import React from 'react';
import {Dimensions, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle, windowPadding} from '../styles/Global';
import {Button} from '../components/Button';
import Swiper from '../components/Swiper/Swiper';
import Pagination from "../components/Swiper/Pagination";
import log from "../helpers/firebaseAnalytic";

export default function WhatIsIt() {
    return (
        <SafeAreaView style={[textStyle.rootViewWrapper, WIIstyles.rootView]}>
            <View style={{marginTop: 0, paddingRight: windowPadding, alignItems: 'flex-end', width: '100%'}}>
                <TouchableOpacity style={{width: 100, height: 60, paddingTop: 5}}
                                  onPress={() => {
                                      Actions.LoginPhone();
                                      log(this, 'login_btn');
                                  }}>
                    <Text style={WIIstyles.loginButton}>Войти</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, width: '100%'}}>
                <Swiper
                    showPagination
                    PaginationComponent={Pagination}
                >
                    <Slide1/>
                    <Slide2/>
                </Swiper>
            </View>
            <View style={WIIstyles.createButtonWrapper}>
                <Button onPress={() => {
                    Actions.Form();
                    log(this, create_battle_btn);
                }} title="Создать новый батл"/>
            </View>
        </SafeAreaView>
    );
}

function Slide1() {
    return (
        <View key={1} style={[WIIstyles.sliderItem]}>
            <Image source={require('../assets/images/what_is_it.png')}
                   style={{marginBottom: 35, width: 120, height: 120}}/>
            <View style={{marginBottom: 20}}>
                <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Что
                    такое{"\n"}банкет-батл?</Text>
            </View>
            <View style={WIIstyles.sliderTextWrapper}>
                <Text style={[textStyle.defaultFont, {
                    textAlign: 'center',
                    fontSize: 15,
                    lineHeight: 20
                }]}>
                    Здесь рестораны соревнуются друг с другом, чтобы сделать для вас лучший банкет. Вам остается только
                    выбрать победителя аукциона!
                </Text>
            </View>
        </View>
    )
}

function Slide2() {
    return (
        <View key={2} style={[WIIstyles.sliderItem, {paddingBottom: 70}]}>
            <Image source={require('../assets/images/how-it-work.png')}
                   style={{marginBottom: 35, width: 130, height: 130}}/>
            <View style={{marginBottom: 20}}>
                <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Как
                    работает{"\n"}банкет-батл</Text>
            </View>
            <View style={[WIIstyles.sliderTextWrapper]}>
                <Text style={[textStyle.defaultFont, {
                    textAlign: 'center',
                    fontSize: 15,
                    lineHeight: 20,
                    paddingBottom: 50
                }]}>
                    Заполняйте заявку. Запускайте аукцион. Получайте предложения от ресторанов. Выбирайте лучшее.
                    Готово!
                </Text>
            </View>
        </View>
    )
}

var {height, width} = Dimensions.get('window');

const WIIstyles = StyleSheet.create({
    rootView: {
        ...Platform.select({
            ios: {},
            android: {},
        }),
    },
    sliderItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
        width: width,
        ...Platform.select({
            ios: {},
            android: {
                width: width - (windowPadding * 2),
            },
        }),
    },
    sliderHeader: {
        lineHeight: 34,
        fontSize: 28,
        color: '#000000',
        textAlign: 'center'
    },
    sliderTextWrapper: {
        width: 300,
    },
    sliderText: {
        fontSize: 20,
        color: '#000000'
    },
    createButtonWrapper: {
        width: width - (windowPadding * 2),
        margin: windowPadding,
        ...Platform.select({
            ios: {},
            android: {
                marginBottom: 0,
            },
        }),
    },
    loginButton: {
        color: '#0C20E3',
        fontSize: 15,
        textAlign: 'right',
        lineHeight: 18,
        fontWeight: '500',
    }
});