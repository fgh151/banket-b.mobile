import React from 'react';
import {ImageBackground, Modal, StyleSheet, TouchableOpacity, View} from "react-native"
import {Button} from './Button';
import {ifIphoneX} from 'react-native-iphone-x-helper'
import {windowPadding} from "../styles/Global";

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

        const styles = {
            menu: {
                width: 23, height: 15
            },
            dots: {
                width: 20, height: 20
            }
        };

        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.toggleModal}
                                  style={{height: '100%', alignItems: 'center', justifyContent: 'center', width: 50}}>
                    <ImageBackground
                        source={images[this.props.image]}
                        resizeMode="stretch"
                        style={styles[this.props.image]}>
                    </ImageBackground>
                </TouchableOpacity>
                <Modal
                    // animationType="fade"
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
        let buttonsCount = this.props.buttons.length;
        return this.props.buttons.map((item, index) => {
            let isLast = buttonsCount === index + 1;
            return (
                <View
                    key={index} style={{paddingBottom: isLast ? 0 : 10}}>
                    <Button
                        onPress={() => {
                            item.action();
                            this.toggleModal();
                        }}
                        title={item.title}
                    />
                </View>
            )
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
        padding: windowPadding,
        position: 'absolute',
        left: 0,
        bottom: 0,
        ...ifIphoneX({
            paddingBottom: 50
        })
    },
});