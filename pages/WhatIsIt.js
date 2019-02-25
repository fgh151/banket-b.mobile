import React from 'react';
import {Image, StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from '../styles/Global';
import {Button} from '../components/Button';
import Swiper from 'react-native-swiper';

export default class WhatIsIt extends React.PureComponent {

    render() {
        return (
            <SafeAreaView style={[textStyle.rootViewWrapper, WIIstyles.rootView]}>
                <View style={{marginTop: 0, alignItems: 'flex-end', width:'100%'}}>
                    <TouchableOpacity style={{width: 100, height:60, paddingTop:5}} onPress={() => Actions.LoginPhone()}>
                        <Text style={WIIstyles.loginButton}>Войти</Text>
                    </TouchableOpacity>
                </View>
                <Swiper
                    loop={false}
                    showsButtons={false}
                    dot={<View style={WIIstyles.sliderDot}/>}
                    activeDot={<View style={WIIstyles.sliderActiveDot}/>}

                >
                    <View style={WIIstyles.sliderItem}>
                        <Image source={require('../assets/images/what_is_it.png')} style={{marginBottom:35}}/>
                        <View style={{marginBottom:20}}>
                        <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Что
                            такое{"\n"}банкет-батл?</Text>
                        </View>
                            <View style={WIIstyles.sliderTextWrapper}>
                            <Text style={[textStyle.defaultFont, {textAlign: 'center', fontSize:15, lineHeight:20}]}>
                                Мучительный выбор площадки для банкета, бесконечные звонки, переплата комиссионных
                                посредникам и в прошлом.
                            </Text>
                            <Text style={[textStyle.defaultFont, {textAlign: 'center', fontSize:15, lineHeight:20, paddingTop: 30}]}>
                                Теперь именно Вы устанавливаете справедливую цену на банкет.
                            </Text>
                        </View>
                    </View>
                    <View style={WIIstyles.sliderItem}>
                        <Image source={require('../assets/images/how-it-work.png')} style={{marginBottom:35}}/>
                        <View style={{marginBottom:20}}>
                        <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Как работает{"\n"}банкет-батл</Text>
                        </View>
                            <View style={WIIstyles.sliderTextWrapper}>
                            <Text style={[textStyle.defaultFont, {textAlign: 'center', fontSize:15, lineHeight:20, paddingBottom: 50}]}>
                                Создаете новый батл. Ожидаете предложений от ресторанов. Выбираете самое лучшее и
                                договариваетесь с рестораном.
                            </Text>
                        </View>
                    </View>
                </Swiper>
                <View style={WIIstyles.createButtonWrapper}>
                    <Button onPress={() => Actions.Form()} title="Создать новый батл"/>
                </View>
            </SafeAreaView>
        );
    }
}

const WIIstyles = StyleSheet.create({

    rootView: {
        ...Platform.select({
            ios: {
                margin: 10
            },
            android: {
            },
        }),
    },

    sliderDot: {
        backgroundColor: 'transparent',
        borderColor: '#0C21E2',
        borderWidth: 1,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4,

        marginBottom:-20
    },
    sliderActiveDot: {
        backgroundColor: '#0C21E2',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4,
        marginBottom:-20
    },
    sliderItem: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        height:352,


    },
    sliderHeader: {
        lineHeight: 34,
        fontSize:28,
        color: '#000000',
        textAlign:'center'
    },
    sliderTextWrapper: {
        width: 300
    },
    sliderText: {
        fontSize: 20,
        color: '#000000'
    },
    createButtonWrapper: {
        width:'100%'
    },
    loginButton: {
        color: '#0C20E3',
        fontSize: 15,
        textAlign: 'right',

        lineHeight:18,
        fontWeight: '500',
    }
});