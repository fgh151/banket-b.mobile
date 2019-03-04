import React from 'react';
import {ImageBackground, Modal, StyleSheet, TouchableOpacity, View} from "react-native"
import {Button} from './Button';

export default class Menu extends React.Component {

    static defaultProps = {
        image: 'menu'
    };
    state = {
        modalVisible: false
    };

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
    };

    render() {

        const images = {
            menu: require('../assets/images/menu.png'),
            dots: require('../assets/images/menu-dots.png')
        };

        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.toggleModal} style={{height: '100%', alignItems: 'center', justifyContent: 'center', width: 50}}>
                    <ImageBackground source={images[this.props.image]} resizeMode="stretch"
                                     style={{width: 20, height: 20}}>
                    </ImageBackground>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}
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
        return this.props.buttons.map((item, index) => {
            return (<Button
                key={index}
                onPress={() => {
                    item.action();
                    this.toggleModal();
                }}
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