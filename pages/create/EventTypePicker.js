import React from "react";
import {Image, StyleSheet} from "react-native";
import PickerSelect from '../../components/PickerSelect';


export default function EventTypePicker(props) {
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
        <PickerSelect
            Icon={() => <Image source={require('../../assets/images/down.png')}/>}
            placeholderTextColor='#000000'
            placeholder={placeholder}
            items={variants}
            showIcon={false}
            onValueChange={(value) => {
                props.onValueChange(value);
            }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
        />
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: '#0C21E2',
        paddingRight: 30, // to ensure the text is never behind the icon
        paddingBottom: 5,
        paddingTop: 5,
        fontSize: 15,
        lineHeight: 18
    },
    inputAndroid: {
        marginTop: -10,
        paddingBottom: 0,

        marginLeft: -5,

        color: '#0C21E2',
        paddingRight: 30, // to ensure the text is never behind the icon
        // marginLeft: -8,

        fontSize: 15,
        lineHeight: 18,

    },
    headlessAndroidContainer: {
        // backgroundColor:'red'
    }
});