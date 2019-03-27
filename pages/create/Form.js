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
import AmountInput, {PLACEHOLDER_TEXT as AMOUNT_PLACEHOLDER_TEXT} from "./AmountInput";
import {ifIphoneX} from "react-native-iphone-x-helper";
import GuestsCountInput, {PLACEHOLDER_TEXT as GUESTS_COUNT_PLACEHOLDER_TEXT} from "./GuestsCountInput";

export default class Form extends React.Component {
    state = {
        buttonDisabled: true,
        eventType: '',
        guests_count_error: '',
        amount_error: '',
        amount_value: null,
        guests_count: null,
        notes: null,
        show_guests_count_placeholder: false,
        inputGCFocus:false,
        show_amount_placeholder: false,
        inputAmountFocus: false,
        show_notes_placeholder:false,
        inputNotesFocus:false,

        hideButton: false
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

        console.log(this.state);
    }

    render() {
        return (
            <View style={[textStyle.rootViewWrapper, {marginTop: 25, padding:0}]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={textStyle.rootView}
                >
                    <Input>
                        <CityPicker/>
                    </Input>
                    <Input>
                        <EventTypePicker onValueChange={(value) => this.setProposalProperty('event_type', value)}/>
                    </Input>
                    <Input>
                        <FormDatePicker onDateChange={(date) => {
                            this.setProposalProperty('date', date)
                        }}/>
                    </Input>
                    <Input>
                        <FormTimePicker onDateChange={(time) => {
                            this.setProposalProperty('time', time)
                        }}/>
                    </Input>
                    <Input
                        style={{marginTop:-10}}
                        error={this.state.guests_count_error}
                        // showPlaceholder={this.state.show_guests_count_placeholder}
                        showPlaceholder={false}
                        placeholder={GUESTS_COUNT_PLACEHOLDER_TEXT}
                    >
                        <GuestsCountInput
                            onChange={this.setProposalProperty}
                            onFocus={() => {this.setState({hideButton: true})}}
                            onBlur={()=>{this.setState({hideButton: false})}}
                        />
                    </Input>
                    <Input
                        style={{marginTop:-10}}
                        error={this.state.amount_error}
                        // showPlaceholder={this.state.show_amount_placeholder}
                        showPlaceholder={false}
                        placeholder={AMOUNT_PLACEHOLDER_TEXT}
                    >
                        <AmountInput
                            onChange={this.setProposalProperty}
                            onFocus={() => {this.setState({hideButton: true})}}
                            onBlur={()=>{this.setState({hideButton: false})}}
                        />
                    </Input>
                    <Input
                        // showPlaceholder={this.state.show_notes_placeholder}
                        showPlaceholder={false}
                        placeholder={'Дополнительно'}
                    >
                            <TextInput
                            multiline
                            refInput={ref => {
                                this.input = ref
                            }}
                            style={[styles.textInput, valid.valid, {
                                marginTop:-10,
                                paddingBottom: 2,
                            }]}
                            placeholderTextColor={'#000000'}
                            onChangeText={(notes) => {this.setProposalProperty('notes', notes); this.setState({notes:notes});}}
                            // onFocus={() => {this.setState({inputNotesFocus: true}, () => this.toggleNotesPlaceHolder())}}
                            // onBlur={()=>{this.setState({inputNotesFocus: false}, () => this.toggleNotesPlaceHolder())}}
                            placeholder='Дополнительно'
                            returnKeyType={'done'}
                            value={this.state.notes}
                            autoCorrect={false}
                        />
                    </Input>
                </ScrollView>
                {this.renderButton()}
            </View>
        )
    }

    renderButton() {
        if (!this.state.hideButton) {
            return (
                <View style={[styles.buttonWrapper, {visibility: this.state.hideButton}]}>
                    <Button
                        style={{fontSize: 17, lineHeight: 21}}
                        disabled={this.state.buttonDisabled}
                        title="Продолжить"
                        onPress={this.nextPage}
                    />
                </View>
            )
        }
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
    buttonWrapper: {
        padding: 15,
        width: '100%',
        ...ifIphoneX({
            marginBottom: 50
        })
    },
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
