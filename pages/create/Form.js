import React from "react";

import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import Input from "../../components/Input";
import {Button} from "../../components/Button";
import DatePicker from 'react-native-datepicker'
import moment from "moment";
import RNPickerSelect from 'react-native-picker-select';

import Proposal from '../../models/Proposal';
import {Actions} from "react-native-router-flux";
import {City} from "../../helpers/GeoLocation";

export default class Form extends React.Component {
    state = {
        buttonDisabled: true,
        eventType: '',


        guests_count_error: '',
        amount_error: '',
    };

    proposal = new Proposal();

    now = moment();

    nextPage = () => {
        Actions.Services();
    };

    getEventTypePicker() {

        const placeholder = {
            label: 'Вид мероприятия',
            value: null,
            color: '#9EA0A4',
        };

        const variants = [
            {label: "Банкет", value: 1},
            {label: "Корпоратив", value: 2},
            {label: "Детский праздник", value: 3},
            {label: "День рождения", value: 4},
            {label: "Юбилей", value: 5},
            {label: "Свадьба", value: 6},
            {label: "Другое", value: 7}
        ];

        return (
            <RNPickerSelect
                placeholderTextColor = '#000000'
                placeholder={placeholder}
                items={variants}
                onValueChange={(value) => {
                    this.setProposalProperty('event_type', value)
                }}
                style={pickerSelectStyles}
            />
        );
    }

    getDatePicker() {
        return (
            <DatePicker
                customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                    },
                    placeholderText: [textStyle.defaultFont, {fontSize:15, color: '#000000'}],
                    dateText: [textStyle.defaultFont, {fontSize:15, color:'#0C21E2'}]
                }}
                style={styles.dateTouch}
                date={this.state.date}
                mode="date"
                placeholder="Выберите дату"
                format="YYYY-MM-DD"
                minDate={this.now.format('YYYY-MM-DD')}
                confirmBtnText="Выбрать"
                cancelBtnText="Отмена"
                showIcon={false}
                onDateChange={(date) => {
                    this.setProposalProperty('date', date)
                }}
            />
        )
    }

    getTimePicker() {
        return (
            <DatePicker
                customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%'
                    },
                    placeholderText: [textStyle.defaultFont, {fontSize:15, color: '#000000'}],
                    dateText: [textStyle.defaultFont, {fontSize:15, color:'#0C21E2'}]
                }}
                style={styles.dateTouch}
                date={this.state.time}
                mode="time"
                placeholder="Выберите время"
                format="HH:mm"
                confirmBtnText="Выбрать"
                cancelBtnText="Отмена"
                showIcon={false}
                onDateChange={(time) => {
                    this.setProposalProperty('time', time)
                }}
            />
        )
    }

    getCityPicker() {
        return (
            <TouchableOpacity
                style={{paddingTop: 10}}
                onPress={() => Actions.CitySelector()}
            >
                <Text style={[textStyle.defaultFont, {paddingBottom: 5, fontSize:15, color:'#000000'}]}>{(new City()).city.title}</Text>
            </TouchableOpacity>
        )
    }

    setProposalProperty(propertyName, value) {

        console.log("validate", value);

        let valid = this.proposal.validateProperty(propertyName, value);
        let errorProp = propertyName + '_error';
        let state = {};

        if (valid === true) {
            state[errorProp] = '';
            this.proposal[propertyName] = value;
            this.setState(this.proposal);
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
            <View style={textStyle.rootView}>
                <ScrollView>
                    <Input
                        component={this.getCityPicker()}
                        active={true}
                    />
                    <Input
                        component={this.getEventTypePicker()}
                        active={true}
                    />
                    <Input
                        component={this.getDatePicker()}
                        active={true}
                    />
                    <Input
                        component={this.getTimePicker()}
                        active={true}
                    />
                    <Input
                        component={<TextInput
                            refInput={ref => {
                                this.input = ref
                            }}
                            style={styles.textInput}
                            placeholderTextColor={'#000000'}
                            onChangeText={(count) => this.setProposalProperty('guests_count', count)}
                            keyboardType="numeric"
                            placeholder='Количество гостей'
                        />}
                        active={true}
                        error={this.state.guests_count_error}
                    />
                    <Input
                        component={<TextInput
                            refInput={ref => {
                                this.input = ref
                            }}
                            style={styles.textInput}
                            placeholderTextColor={'#000000'}
                            onChangeText={(amount) => this.setProposalProperty('amount', amount)}
                            keyboardType="numeric"
                            placeholder='Стоимость на гостя'
                        />}
                        active={true}
                        error={this.state.amount_error}
                    />

                    <Input
                        component={<TextInput
                            multiline
                            refInput={ref => {
                                this.input = ref
                            }}
                            style={styles.textInput}
                            placeholderTextColor={'#000000'}
                            onChangeText={(notes) => this.setProposalProperty('notes', notes)}
                            placeholder='Дополнительно'
                        />}
                        active={true}
                    />
                </ScrollView>

                <Button
                    disabled={this.state.buttonDisabled}
                    title="Продолжить"
                    onPress={this.nextPage}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    textInput : {
        fontSize:15,
        ...Platform.select({
            ios: {
                paddingTop:10,
                paddingBottom:5
            },
            android: {
                marginLeft: -5
            },
        }),
    }

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: '#0C21E2',
        paddingRight: 30, // to ensure the text is never behind the icon
        paddingBottom: 5,
        paddingTop:10
    },
    inputAndroid: {
        color: '#0C21E2',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginLeft: -8
    },
});