import React from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from "react-native"
import {Button} from './Button';

export default class Menu extends React.Component {

    state = {
        modalVisible: false
    };

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.toggleModal}>
                    <Image style={{margin: 15}} source={require('../assets/images/menu.png')} on/>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <TouchableOpacity style={ModalStyle.overlay}
                          onPress={this.toggleModal}
                    >
                        <View style={ModalStyle.content}>
                            {this.renderButtons()}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }

    renderButtons() {
         return this.props.buttons.map((item) => {
            return (<Button
                onPress={() => item.action()}
                title={item.title}
            />)
        })
    }
}

const ModalStyle = StyleSheet.create({
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
        padding: 15,
        position: 'absolute',
        left: 0,
        bottom: 0
    },

});