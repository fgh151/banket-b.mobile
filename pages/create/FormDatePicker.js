import React from "react";
import DatePicker from 'react-native-datepicker'
import {Styles as textStyle} from "../../styles/Global";
import {Platform, StyleSheet} from "react-native";
import moment from "moment";

export default class FormDatePicker extends React.Component{

    state = {
        date: '',
        datePlaceholder: 'Выберите дату',
        dateValue: moment().format('DD MMMM YYYY')
    };

    render() {
        const minDate = moment().format('DD MMMM YYYY');
        const maxDate = moment().add(1, 'year').format('DD MMMM YYYY');
        return (
            <DatePicker
                customStyles={pickerStyle}
                style={styles.dateTouch}
                date={this.state.date}
                mode="date"
                value={this.state.dateValue}
                placeholder={this.state.datePlaceholder}
                format="DD MMMM YYYY"
                minDate={minDate}
                maxDate={maxDate}
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

const pickerStyle = {
    dateInput: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        paddingBottom: 5,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        ...Platform.select({
            ios: {
                marginTop: 25
            },
            android: {
                marginTop: 35
            },
        }),
    },
    placeholderText: [textStyle.defaultFont, {fontSize: 15, color: '#000000', paddingTop: 5, marginBottom: -10}],
    dateText: [textStyle.defaultFont, {fontSize: 15, color: '#0C21E2', paddingTop: 5, marginBottom: -10}],
    btnTextConfirm: {
        color: '#0C21E2'
    }
};

const styles = StyleSheet.create({

    dateTouch: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',


    },
});
