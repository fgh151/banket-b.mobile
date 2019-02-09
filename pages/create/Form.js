import React from "react";

import {Picker, ScrollView, TextInput, View, StyleSheet} from "react-native";
import {Styles as textStyle} from "../../styles/Global";
import Input from "../../components/Input";
import {Button} from "../../components/Button";
import DatePicker from 'react-native-datepicker'
import moment from "moment";

import Proposal from '../../models/Proposal';
import {Actions} from "react-native-router-flux";

export default class Form extends React.Component {
    state = {
        buttonDisabled: true,
        eventType: '',


        guests_count_error:'',
        amount_error:'',
    };

    proposal = new Proposal();

    now = moment();

    nextPage = () => {
        Actions.Services();
    };

    getEventTypePicker() {
        return (
            <Picker
                selectedValue={this.state.eventType}
                prompt="Вид мероприятия"
                onValueChange={(itemValue, itemIndex) =>
                    this.setProposalProperty('event_type', itemValue)
                }>
                <Picker.Item label="Банкет" value="1"/>
                <Picker.Item label="Корпоратив" value="2"/>
                <Picker.Item label="Детский праздник" value="3"/>
                <Picker.Item label="День рождения" value="4"/>
                <Picker.Item label="Юбилей" value="5"/>
                <Picker.Item label="Свадьба" value="6"/>
                <Picker.Item label="Другое" value="7"/>
            </Picker>
        )
    }

    getDatePicker() {
        return (
            <DatePicker
                customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingLeft: 10,
                        width: '100%'
                    },
                    placeholderText: textStyle.defaultFont,
                    dateText: textStyle.defaultFont
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
        return(
            <DatePicker
                customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingLeft: 10,
                        width: '100%'
                    },
                    placeholderText: textStyle.defaultFont,
                    dateText: textStyle.defaultFont
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

    setProposalProperty(propertyName, value) {

        console.log("validate", value);

        let valid = this.proposal.validateProperty(propertyName, value);
        let errorProp = propertyName+'_error';
        let state = {};

        if (valid === true ) {
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
                        component={<TextInput
                            refInput={ref => {
                                this.input = ref
                            }}
                            placeholder='Город'
                        />}
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
                            onChangeText={(amount) => this.setProposalProperty('amount', amount)}
                            keyboardType="numeric"
                            placeholder='Стоимость'
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
});