import React from 'react';
import {Modal, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WheelPicker} from 'react-native-wheel-picker-android'

import {Button} from '../../components/Button';
import {windowPadding} from "../../styles/Global";

const timePeriod = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '10:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];

const defaultValue = timePeriod[23] + ' - ' + timePeriod[24];

export default class FormTimePicker extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            viewText: 'Время',
            startTime: null,
            endTime: null,
            selectedStart: '12:00',
            selectedEnd: '12:00',
            valid: false,
            selectedItemStart: 24,
            selectedItemEnd: 24,

            timePeriod: timePeriod,
            endTimePeriod: timePeriod,
            startTimePeriod: timePeriod
        };
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{marginTop: 2}}>
                    <TouchableOpacity style={ModalStyle.button} onPress={() => this.setState({modalVisible: true})}>
                        <Text style={[ModalStyle.buttonText, {color: this.state.valid ? '#0C21E2' : '#000000'}]}>
                            {this.state.viewText}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                        }}
                    >
                        <TouchableOpacity style={ModalStyle.overlay}
                                          onPress={() => this.onClose()}
                        >
                        </TouchableOpacity>
                        <View style={ModalStyle.content}>
                            {this.renderPicker()}
                            <View style={ModalStyle.doneWrapper}>
                                <Button
                                    style={ModalStyle.doneButton}
                                    onPress={() => this.onClose()}
                                    title={'Сохранить'}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        )
    }

    onClose() {
        let newSate = {modalVisible: false};
        if (!this.state.valid) {
            this.onDateChange(defaultValue);
            newSate.viewText = defaultValue;
            newSate.valid = true;
        }
        this.setState(newSate);
    }

    onstartSelected = selectedItem => {
        let value = timePeriod[selectedItem];
        let endTime = timePeriod.slice(selectedItem);
        let state = {
            startTime: value,
            selectedStart: selectedItem,
            selectedItemStart: selectedItem,
            endTimePeriod: endTime
        };
        let end = endTime[0] === undefined ? '12:00' : endTime[0];
        if (endTime[0]) {
            state.viewText = value + ' - ' + end;
            state.valid = true;
            this.onDateChange(state.viewText);
        }
        this.setState(state)
    };

    onEndSelected = selectedItem => {
        let value = this.state.endTimePeriod[selectedItem];
        value = value === undefined ? '12:00' : value;
        let state = {
            endTime: value,
            selectedEnd: selectedItem,
            selectedItemEnd: selectedItem,
            valid: true
        };
        if (this.state.startTime !== null) {
            state.viewText = this.state.startTime + ' - ' + value;
        } else {
            state.viewText = '12:00 - ' + value;
        }
        this.onDateChange(state.viewText);
        this.setState(state)
    };

    onDateChange(date) {
        this.props.onDateChange(date);
    }

    renderPicker() {
        return (
            <View style={ModalStyle.pickersWrapper}>
                <View style={ModalStyle.pickerColumn}>
                    <Text style={{textAlign: 'center'}}>Начало</Text>
                    <WheelPicker
                        selectedValue={this.state.selectedStart}
                        selectedItem={this.state.selectedItemStart}
                        data={this.state.startTimePeriod}
                        onItemSelected={this.onstartSelected}/>
                </View>
                <View style={ModalStyle.pickerColumn}>
                    <Text style={{textAlign: 'center'}}>Окончание</Text>
                    <WheelPicker
                        selectedValue={this.state.selectedEnd}
                        selectedItem={this.state.selectedItemEnd}
                        data={this.state.endTimePeriod}
                        onItemSelected={this.onEndSelected}/>
                </View>
            </View>
        )
    }
}

const ModalStyle = StyleSheet.create({
    button: {
        paddingBottom: 5,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        ...Platform.select({
            ios: {
                paddingTop: 35,
            },
            android: {
                paddingTop: 25
            },
        }),
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 18,
        fontFamily: "Lato-Regular",
    },
    pickersWrapper:{
        flexDirection: 'row',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                paddingBottom:50,
            },
            android: {},
        }),
    },
    doneWrapper: {
        width: '100%',
        paddingLeft: windowPadding,
        paddingRight: windowPadding,
    },
    doneButton: {
        padding: 10,
        backgroundColor: '#0C21E2',
        color:'#ffffff',
    },

    pickerColumn: {
        flexDirection: 'column',
        width: '50%',
        alignItems: 'center',
        margin: 10,

        ...Platform.select({
            ios: {
            },
            android: {
                marginBottom: -20
            },
        }),
    },
    overlay: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    content: {
        width: '100%',
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingBottom: windowPadding,
        position: 'absolute',
        left: 0,
        bottom: 0
    },
});