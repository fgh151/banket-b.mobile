import React from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import {Styles as textStyle, windowPadding} from "../../styles/Global";
import {Button} from "../../components/Button";
import moment from "moment";
import Proposal from '../../models/Proposal';
import {Actions} from "react-native-router-flux";
import FormDatePicker from './FormDatePicker';
import FormTimePicker from './FormTimePicker';
import EventTypePicker from "./EventTypePicker";
import CityPicker from "./CityPicker";
import AmountInput from "./AmountInput";
import {ifIphoneX} from "react-native-iphone-x-helper";
import GuestsCountInput from "./GuestsCountInput";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import FormPage, {commonStyles} from './AbstractFormPage';
import {STORAGE_GEO_CACHE_KEY} from "../../helpers/Constants";
import MetroPicker from "./MetroPicker";
import AS from "@react-native-community/async-storage";
import log from "../../helpers/firebaseAnalytic";

export default class Form extends FormPage {

    proposal = new Proposal();
    now = moment();

    constructor(props) {
        super(props);
        this.setProposalProperty = this.setProposalProperty.bind(this);

        this.state = {
            buttonDisabled: true,
            eventType: '',
            guests_count_error: '',
            amount_error: '',
            amount_value: null,
            guests_count: null,
            show_guests_count_placeholder: false,
            inputGCFocus: false,
            show_amount_placeholder: false,
            inputAmountFocus: false,

            hideButton: false,

            metro: null,
            city_id: 1,


            city: null
        };
    }

    componentDidMount() {
        AS.getItem(STORAGE_GEO_CACHE_KEY).then(data => {

            let city = JSON.parse(data)[0];
            this.setState({city: city}, () => console.log(this.state.city))
        })
    }

    nextPage = () => {
        Actions.Services();
        log(this, 'next_btn');
    };

    render() {

        log(this, 'render');
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustPan();
        }

        let metro = this.state.city ? <MetroPicker onChange={(value) => this.setProposalProperty('metro', value.id)}
                                                   stations={this.state.city.metro}/> : null;

        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                contentContainerStyle={commonStyles.contentContainerStyle}
                innerRef={ref => {
                    this.scroll = ref
                }}
            >
                <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={[textStyle.rootView, styles.formWrapper]}>
                        <CityPicker onChange={(city, cityId) => {
                            this.setProposalProperty('city_id', cityId);
                            this.setState({city: city})
                        }}/>

                        {metro}

                        <EventTypePicker onValueChange={(value) => this.setProposalProperty('event_type', value)}/>

                        <FormDatePicker onDateChange={(date) => {
                            this.setProposalProperty('date', date)
                        }}/>
                        <FormTimePicker
                            onRequestClose={() => {
                                if (this.proposal.time === null) {
                                    this.proposal.time = '12:00 - 12:30'
                                }
                            }}
                            onDateChange={(time) => {
                                this.setProposalProperty('time', time)
                            }}/>

                        <GuestsCountInput
                            onChange={this.setProposalProperty}
                            onFocus={() => this.setState({hideButton: true})}
                            onBlur={() => this.setState({hideButton: false})}
                        />

                        <Text style={styles.error}>{this.state.amount_error}</Text>
                        <AmountInput
                            onChange={this.setProposalProperty}
                            onFocus={() => this.setState({hideButton: true})}
                            onBlur={() => this.setState({hideButton: false})}
                        />


                        <View ref={ref => {
                            this.marker = ref
                        }}/>
                    </View>
                </View>
                <View style={{padding: windowPadding}}>
                    {this.renderButton()}
                </View>
            </KeyboardAwareScrollView>
        )
    }


    renderButton() {
        if (!this.state.hideButton) {
            return (
                <View style={[styles.buttonWrapper, {visibility: this.state.hideButton,}]}>
                    <Button
                        style={{fontSize: 17, lineHeight: 21}}
                        disabled={this.state.buttonDisabled}
                        title="Продолжить"
                        onPress={this.nextPage}
                    />
                </View>
            )
        }
        return null;
    }
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        marginTop: 8,
        height: 18,
    },

    formWrapper: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        ...Platform.select({
            ios: {
                paddingTop: 45
            },
            android: {
                paddingTop: 30
            },
        }),
    },
    buttonWrapper: {
        width: '100%',
        ...ifIphoneX({
            marginBottom: 50
        }),
    },
    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});
