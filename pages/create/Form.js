import React from "react";

import {Platform, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import Input from "../../components/Input";
import {Button} from "../../components/Button";
import moment from "moment";

import Proposal from '../../models/Proposal';
import {Actions} from "react-native-router-flux";

import FormDatePicker from './FormDatePicker';
import FormTimePicker from './FormTimePicker';
import EventTypePicker from "./EventTypePicker";
import CityPicker from "./CityPicker";
import AmountInput from "./AmountInput";

export default class Form extends React.Component {
    state = {
        buttonDisabled: true,
        eventType: '',
        guests_count_error: '',
        amount_error: '',

        amount_value: null,

        guests_count: null,
        notes: null
    };

    proposal = new Proposal();
    now = moment();
    nextPage = () => {
        Actions.Services();
    };

    constructor(props) {
        super(props);
        this.setProposalProperty = this.setProposalProperty.bind(this);
    }

    setProposalProperty(propertyName, value) {

        console.log("validate", propertyName, value);

        let valid = this.proposal.validateProperty(propertyName, value);
        let errorProp = propertyName + '_error';
        let state = {};

        this.proposal[propertyName] = value;
        this.setState(this.proposal);

        if (valid === true) {
            state[errorProp] = '';
            console.log('Proposal changed ', this.proposal);
            if (this.proposal.validate()) {
                state['buttonDisabled'] = false;
            }
        } else {
            console.log('Invalid!');
            state['buttonDisabled'] = true;
            state[errorProp] = valid;
        }
        this.setState(state);

        console.log(this.state, state);
    }

    render() {
        return (
            <View style={textStyle.rootViewWrapper}>
                <ScrollView
                    style={textStyle.rootView}
                >
                    <Input
                        component={<CityPicker/>}
                        active={true}
                        valid={true}

                    />
                    <Input
                        component={<EventTypePicker
                            onValueChange={(value) => this.setProposalProperty('event_type', value)}/>}
                        active={true}

                    />
                    <Input
                        component={<FormDatePicker onDateChange={(date) => {
                            this.setProposalProperty('date', date)
                        }}/>}
                        active={true}

                    />
                    <Input
                        component={<FormTimePicker onDateChange={(time) => {
                            this.setProposalProperty('time', time)
                        }}/>}
                        active={true}

                    />
                    {/*<Input*/}
                        {/*component={*/}
                            <TextInput
                            refInput={ref => {
                                this.input = ref
                            }}
                            style={[styles.textInput, valid.valid, { borderBottomWidth: 1,
                                borderBottomColor: '#E0E0E0',
                                paddingBottom: 15,}]}
                            placeholderTextColor={'#000000'}
                            onChangeText={(count) => {this.setProposalProperty('guests_count', count); this.setState({guests_count:count})}}
                            keyboardType="numeric"
                            placeholder='Количество гостей'
                            returnKeyType={'done'}
                            value={333}
                        />
                        {/*}*/}
                        {/*active={true}*/}
                        {/*valid={true}*/}
                        {/*error={this.state.guests_count_error}*/}

                    {/*/>*/}
                    <Input
                        component={
                            <AmountInput onChange={this.setProposalProperty}/>
                        }
                        active={true}
                        error={this.state.amount_error}
                    />

                    {/*<Input*/}
                        {/*component={*/}
                            <TextInput
                            multiline
                            refInput={ref => {
                                this.input = ref
                            }}
                            style={[styles.textInput, valid.valid, { borderBottomWidth: 1,
                                borderBottomColor: '#E0E0E0',
                                paddingBottom: 15,}]}
                            placeholderTextColor={'#000000'}
                            onChangeText={(notes) => {this.setProposalProperty('notes', notes); this.setState({notes:notes});}}
                            placeholder='Дополнительно'
                            returnKeyType={'done'}
                            value={this.state.notes}
                        />
                        {/*}*/}
                        {/*active={true}*/}

                    {/*/>*/}
                </ScrollView>

                <View style={{width: '100%'}}>
                    <Button
                        style={{fontSize: 17, lineHeight: 21}}
                        disabled={this.state.buttonDisabled}
                        title="Продолжить"
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        )
    }

}

const valid = StyleSheet.create({
    valid: {
        color: '#0C21E2'
    },
    invalid: {
        color: '#000000'
    }
});

const styles = StyleSheet.create({
    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    textInput: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
        ...Platform.select({
            ios: {
                paddingTop: 10,
                paddingBottom: 5
            },
            android: {
                marginLeft: -5
            },
        }),
    }

});
