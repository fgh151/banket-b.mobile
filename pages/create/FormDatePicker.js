import React from "react";
import DatePicker from 'react-native-datepicker'
import {Styles as textStyle} from "../../styles/Global";
import {Platform, StyleSheet, View, Text} from "react-native";
import moment from "moment";

export default class FormDatePicker extends React.Component{

    state = {
        date: '',
        datePlaceholder: 'Выберите дату',
        dateValue: ''
    };


    now = moment();

    render() {
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
                value={this.state.dateValue}
                placeholder={this.state.datePlaceholder}
                format="DD MMMM YYYY"
                minDate={this.now.format('YYYY-MM-DD')}
                confirmBtnText="Выбрать"
                cancelBtnText="Отмена"
                showIcon={false}
                onDateChange={(date) => {
                    console.log(date);
                    this.props.onDateChange(date);
                    this.setDatePlaceholder(date);
                }}
            />
        )
    }

    setDatePlaceholder(date)
    {
        this.setState({dateValue:date, date:date, datePlaceholder:''})
    }

}

const styles = StyleSheet.create({
    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});