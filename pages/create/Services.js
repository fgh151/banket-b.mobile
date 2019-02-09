import React from "react";

import {Text, View, StyleSheet, ScrollView} from "react-native"
import {Styles as textStyle} from "../../styles/Global";
import {Button} from "../../components/Button";
import ServiceInput from '../../components/ServiceInput';
import Proposal from "../../models/Proposal";
import {Actions} from "react-native-router-flux";

export default class Services extends React.Component{


    proposal = new Proposal();

    nextPage = () =>{
        this.proposal.save();
    };

    toggleProp = (propertyName) => {
        this.proposal[propertyName] = !this.proposal[propertyName];


        console.log(this.proposal);
    };

    render() {
        return(
            <View style={textStyle.rootView}>

                <ScrollView>


                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: 'wrap'
                    }}>
                        <ServiceInput text="Флористика" onPress={() => this.toggleProp('floristics')}/>
                        <ServiceInput text="Оформление зала" onPress={() => this.toggleProp('hall')}/>
                        <ServiceInput text="Фото и видео" onPress={() => this.toggleProp('photo')}/>
                        <ServiceInput text="Стилисты" onPress={() => this.toggleProp('stylists')}/>
                        <ServiceInput text="Торты" onPress={() => this.toggleProp('cake')}/>
                        <ServiceInput text="Транспорт" onPress={() => this.toggleProp('transport')}/>
                    </View>



                </ScrollView>
                <Button
                    title="Продолжить"
                    onPress={this.nextPage}
                />
            </View>
        )
    }

}