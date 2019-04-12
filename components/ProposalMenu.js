import React from 'react';
import {ImageBackground, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {Button} from './Button';
import {ifIphoneX} from "react-native-iphone-x-helper";

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

    renderServiceItems() {
        if (this.state.proposal) {
            let services = [];
            if (this.state.proposal.floristics) {
                services.push(<Service text="Флористика" key={1}/>)
            }
            if (this.state.proposal.hall) {
                services.push(<Service text="Оформление зала" key={2}/>)
            }
            if (this.state.proposal.photo) {
                services.push(<Service text="Фото и видео" key={3}/>)
            }
            if (this.state.proposal.stylists) {
                services.push(<Service text="Стилисты" key={4}/>)
            }
            if (this.state.proposal.cake) {
                services.push(<Service text="Торты" key={5}/>)
            }
            if (this.state.proposal.transport) {
                services.push(<Service text="Транспорт" key={6}/>)
            }
            if (this.state.proposal.entertainment) {
                services.push(<Service text="Развлекательная программа" key={7}/>)
            }
            if (this.state.proposal.present) {
                services.push(<Service text="Подарки" key={8}/>)
            }
            if (this.state.proposal.parking) {
                services.push(<Service text="Парковка" key={9}/>)
            }
            if (this.state.proposal.private) {
                services.push(<Service text="Отдельный зал" key={10}/>)
            }
            if (this.state.proposal.dance) {
                services.push(<Service text="Танцпол" key={11}/>)
            }
            if (this.state.proposal.own_alcohol) {
                services.push(<Service text="Свой алкоголь" key={12}/>)
            }
            return services;
        }
        return null;
    }

    /**
     * @returns {boolean}
     */
    hasServices() {
        if (this.state.proposal) {
            return this.state.proposal.floristics === true || this.state.proposal.hall === true || this.state.proposal.photo === true || this.state.proposal.stylists === true || this.state.proposal.cake === true || this.state.proposal.transport === true ||
                this.state.proposal.entertainment === true || this.state.proposal.present === true || this.state.proposal.parking === true || this.state.proposal.private === true || this.state.proposal.dance === true || this.state.proposal.own_alcohol === true;
        }
        return false;
    }

    /**
     * @returns {*}
     */
    renderServices() {
        if (this.hasServices()) {
            return (
                <View style={{marginBottom: 20, marginTop: 10}}>
                    <Text style={{textAlign: 'center', marginBottom: 20}}>Дополнительные услуги</Text>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: 'wrap',
                        ...Platform.select({
                            ios: {},
                            android: {
                                maxWidth: 320,
                            },
                        }),
                    }}>
                        {this.renderServiceItems()}
                    </View>

                </View>
            )
        }
        return null;
    }

    /**
     * @returns {*}
     */
    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.toggleModal} style={style.buttonWrapper}>
                    <ImageBackground source={require('../assets/images/menu-dots.png')} resizeMode="contain"
                                     style={{width: 20, height: 5}}>
                    </ImageBackground>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <TouchableOpacity style={ModalStyle.overlay} onPress={this.toggleModal}/>
                    <View style={ModalStyle.content}>
                        {this.renderServices()}
                        {this.renderButtons()}
                    </View>
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

function Service(props) {
    return (
        <View style={style.inactiveWrapper}>
            <Text>
                {props.text}
            </Text>
        </View>
    )
}

const style = StyleSheet.create({
    buttonWrapper: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 50,
        paddingBottom: 30,
        ...Platform.select({
            ios: {
                paddingTop: 20,
            },
            android: {
                paddingTop: 24,
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
        margin: 5,
        marginBottom: 6,
        borderRadius: 20,
        backgroundColor: '#E7E7E7',
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
        bottom: 0,
        ...ifIphoneX({
            paddingBottom: 50,
        })
    },
});