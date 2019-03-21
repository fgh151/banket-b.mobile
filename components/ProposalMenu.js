import React from 'react';
import {ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native"
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

    componentDidMount() {
        this.setState({proposal: this.props.getProposal()})
    }

    renderServices() {

        if (this.state.proposal) {
            let services = [];
            if (this.state.proposal.floristics) {
                services.push(<Service text="Флористика"/>)
            }
            if (this.state.proposal.hall) {
                services.push(<Service text="Оформление зала"/>)
            }
            if (this.state.proposal.photo) {
                services.push(<Service text="Фото и видео"/>)
            }
            if (this.state.proposal.stylists) {
                services.push(<Service text="Стилисты"/>)
            }
            if (this.state.proposal.cake) {
                services.push(<Service text="Торты"/>)
            }
            if (this.state.proposal.transport) {
                services.push(<Service text="Транспорт"/>)
            }
            if (this.state.proposal.entertainment) {
                services.push(<Service text="Развлекательная программа"/>)
            }
            if (this.state.proposal.present) {
                services.push(<Service text="Подарки"/>)
            }
            if (this.state.proposal.parking) {
                services.push(<Service text="Парковка"/>)
            }
            if (this.state.proposal.private) {
                services.push(<Service text="Отдельный зал"/>)
            }
            if (this.state.proposal.dance) {
                services.push(<Service text="Танцпол"/>)
            }
            if (this.state.proposal.own_alcohol) {
                services.push(<Service text="Свой алкоголь"/>)
            }
            return services;
        }
        return null;
    }

    render() {


        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.toggleModal} style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    paddingTop: 15
                }}>
                    <ImageBackground source={require('../assets/images/menu-dots.png')} resizeMode="contain"
                                     style={{width: 20, height: 5}}>
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
                            <View style={{marginBottom: 10}}>
                                <Text style={{textAlign: 'center'}}>Дополнительные услуги</Text>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                    flexWrap: 'wrap'
                                }}>
                                    {this.renderServices()}
                                </View>

                            </View>
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

class Service extends React.Component {
    render() {
        return (
            <View style={style.inactiveWrapper}>
                <Text>
                    {this.props.text}
                </Text>
            </View>
        )
    }

}

const style = StyleSheet.create({
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
    inactiveWrapper: {
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 11,
        paddingBottom: 11,
        margin: 10,
        borderRadius: 20,
        backgroundColor: '#E7E7E7',
        alignSelf: 'flex-start'
    },
});

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