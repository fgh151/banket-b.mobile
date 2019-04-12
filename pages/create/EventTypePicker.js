import React from "react";
import {Image, StyleSheet} from "react-native";
import PickerSelect from '../../components/PickerSelect';
import {windowPadding} from "../../styles/Global";


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
            androidMargin={0}
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
        paddingBottom: 5,
        paddingTop: 5,
        fontSize: 15,
        lineHeight: 18,

        width: '100%',

        marginTop: windowPadding,

        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    },
    inputAndroidContainer: {
    },
    inputAndroid: {
        marginTop: 0,
        paddingBottom: 5,
        paddingTop: 25,

        paddingLeft: 0,

        // marginLeft: -5,

        color: '#0C21E2',
        paddingRight: 30, // to ensure the text is never behind the icon
        // marginLeft: -8,


        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,

        fontSize: 15,
        lineHeight: 18,

    },
    headlessAndroidContainer: {
        // backgroundColor:'red'
    }
});