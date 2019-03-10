import React from 'react';
import {Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WheelPicker} from 'react-native-wheel-picker-android'

const timePeriod = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '10:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];

export default class FormTimePicker extends React.Component {

    state = {
        modalVisible: false,
        viewText: 'Время',
        startTime: null,
        endTime: null,
        selectedStart: null,
        selectedEnd: null,
        valid: false
    };

    render() {
        return (
            <SafeAreaView>
                <View>
                    <TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
                        <Text style={[{
                            paddingBottom: 5,
                            fontSize: 15,
                            color: this.state.valid ? '#0C21E2' : '#000000'
                        }]}>{this.state.viewText}</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                        }}
                    >
                        <TouchableOpacity style={ModalStyle.overlay}
                                          onPress={() => this.setState({modalVisible: false})}
                        >
                        </TouchableOpacity>
                        <View style={ModalStyle.content}>
                            {this.renderPicker()}
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        )
    }


    onstartSelected = selectedItem => {
        let value = timePeriod[selectedItem];
        let state = {startTime: value, selectedStart: selectedItem};
        if (this.state.endTime !== null) {
            state.viewText = value + ' - ' + this.state.endTime;
            state.valid = true;
            this.onDateChange(state.viewText);
        }
        this.setState(state)
    };

    onEndSelected = selectedItem => {
        let value = timePeriod[selectedItem];
        let state = {endTime: value, selectedEnd: selectedItem};
        if (this.state.startTime !== null) {
            state.viewText = this.state.startTime + ' - ' + value;
            state.valid = true;
            this.onDateChange(state.viewText);
        }
        this.setState(state)
    };

    onDateChange(date) {
        this.props.onDateChange(date);
    }

    renderPicker() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={ModalStyle.pickerColumn}>
                    <Text style={{textAlign: 'center'}}>Начало</Text>
                    <WheelPicker
                        selectedValue={this.state.selectedStart}
                        selectedItem={this.state.selectedItem}
                        data={timePeriod}
                        onItemSelected={this.onstartSelected}/>
                </View>
                <View style={ModalStyle.pickerColumn}>
                    <Text style={{textAlign: 'center'}}>Окончание</Text>
                    <WheelPicker
                        selectedValue={this.state.selectedEnd}
                        selectedItem={this.state.selectedItem}
                        data={timePeriod}
                        onItemSelected={this.onEndSelected}/>
                </View>
            </View>
        )
    }
}


const ModalStyle = StyleSheet.create({
    pickerColumn: {
        flexDirection: 'column',
        width: '50%',
        margin: 10,
        alignItems: 'center'
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
        paddingTop: 15,
        paddingBottom: 15,
        position: 'absolute',
        left: 0,
        bottom: 0
    },
});