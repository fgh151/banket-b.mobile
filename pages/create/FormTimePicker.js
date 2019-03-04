import React from "react";
import DatePicker from 'react-native-datepicker'
import {Styles as textStyle} from "../../styles/Global";
import {Platform, StyleSheet, View, Text} from "react-native";
import moment from "moment";

export default class FormTimePicker extends React.Component{

    state = {
        time: '',
        datePlaceholder: 'Выберите время',
        dateValue: ''
    };

    render() {
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
                    dateText: [textStyle.defaultFont, {fontSize:15, color:'#0C21E2'}],
                    btnTextConfirm : {
                        color: '#0C21E2'
                    }
                }}
                style={styles.dateTouch}
                date={this.state.time}
                mode="time"
                value={this.state.dateValue}
                placeholder={this.state.datePlaceholder}
                format="HH:mm"
                confirmBtnText="Выбрать"
                cancelBtnText="Отмена"
                showIcon={false}
                onDateChange={(time) => {

                    this.props.onDateChange(time);
                    this.setDatePlaceholder(time);
                }}
            />
        )
    }

    setDatePlaceholder(date)
    {
        this.setState({dateValue:date, date: date, datePlaceholder:''})
    }
}


const styles = StyleSheet.create({
    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});