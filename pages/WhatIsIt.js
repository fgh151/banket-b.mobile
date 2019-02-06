import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import {Actions} from "react-native-router-flux";
import {Styles as textStyle} from '../styles/Global';
import {Button} from '../components/Button';
import Swiper from 'react-native-swiper';

export default class WhatIsIt extends React.PureComponent {

    render() {
        return (
            <View style={textStyle.rootView}>
                <View>
                    <Text style={WIIstyles.loginButton}
                          onPress={() => Actions.LoginCode({phone: '+7 (977) 806 94 28'})}>Войти</Text>
                </View>
                <Swiper
                    showsButtons={false}
                    dot={<View style={WIIstyles.sliderDot}/>}
                    activeDot={<View style={WIIstyles.sliderActiveDot}/>}

                >
                    <View style={WIIstyles.sliderItem}>
                        <Image source={require('../assets/images/what_is_it.png')}/>
                        <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Что это
                            такое{"\n"}банкет-батл?</Text>
                        <View style={WIIstyles.sliderTextWrapper}>
                            <Text style={[textStyle.defaultFont, {textAlign: 'center'}]}>
                                Мучительный выбор площадки для банкета, бесконечные звонки, переплата комиссионных
                                посредникам и в прошлом.
                            </Text>
                            <Text style={[textStyle.defaultFont, {textAlign: 'center'}]}>
                                Теперь именно Вы устанавливаете справедливую цену на банкет.
                            </Text>
                        </View>
                    </View>
                    <View style={WIIstyles.sliderItem}>
                        <Image source={require('../assets/images/how-it-work.png')}/>
                        <Text style={[textStyle.boldFont, WIIstyles.sliderHeader]}>Как работает{"\n"}банкет-батл</Text>
                        <View style={WIIstyles.sliderTextWrapper}>
                            <Text style={[textStyle.defaultFont, {textAlign: 'center'}]}>
                                Создаете новый батл. Ожидаете предложений от ресторанов. Выбираете самое лучшее и
                                договариваетесь с рестораном.
                            </Text>
                        </View>
                    </View>
                </Swiper>
                <View style={WIIstyles.createButtonWrapper}>
                    <Button onPress={() => Actions.Create()} title="Создать новый батл"/>
                </View>
            </View>
        );
    }
}

const WIIstyles = StyleSheet.create({
    sliderDot: {
        backgroundColor: 'transparent',
        borderColor: '#0C21E2',
        borderWidth: 1,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4
    },
    sliderActiveDot: {
        backgroundColor: '#0C21E2',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
        marginRight: 4
    },
    sliderItem: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderHeader: {
        fontSize: 34,
        color: '#000000'
    },
    sliderTextWrapper: {
        width: 300
    },
    sliderText: {
        fontSize: 20,
        color: '#000000'
    },
    createButtonWrapper: {},
    loginButton: {
        color: '#0C20E3',
        fontSize: 18,
        textAlign: 'right'
    }
});