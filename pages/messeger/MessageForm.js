import React, {Component} from "react";
import moment from "moment";
import {db} from '../../Config';
import {Button, TextInput, View, AsyncStorage, Image, Platform} from "react-native";

export default class MessageForm extends Component {

    constructor(props) {
        super(props);

        this.proposalId = this.props.proposalId;
        this.organizationId = this.props.organizationId;

        this.state = {
            author_class: "app\\common\\models\\MobileUser",
            organization_id: this.props.organizationId,
            proposal_id: this.props.proposalId,
            created_at: moment().format('X').toString(),
            message: ""
        }
    }

    static getSendIconName() {
        switch (Platform.OS) {
            case 'ios': {
                return 'ios-send';
            }
        }
        return 'md-send';
    }

    sendMessage() {
        AsyncStorage.getItem('battle@id')
            .then((id) => {
                const path = '/proposal_2/u_' + id + '/p_' + this.proposalId + '/o_' + this.organizationId + '/' + this.state.created_at;
                db.ref(path).set(JSON.stringify(this.state));
                this.setState({
                    message: "",
                    created_at: moment().format('X'),
                })
            });
    }

    render() {
        return (
            <View>
                        <View>
                            <TextInput
                                autoFocus={true}
                                placeholderTextColor="#fff"
                                placeholder="Новое сообщение"
                                value={this.state.message}
                                onChangeText={(txt) => this.setState({message: txt})}
                            />
                        </View>
                        <Button transparent
                                onPress={() => this.sendMessage()}>

                            <Image
                                source={require('../../../assets/images/send.png')}
                            />

                        </Button>
            </View>
        )
    }
}