import React from "react";

import {ScrollView, View} from "react-native"
import {Styles as textStyle} from "../../styles/Global";
import {Button} from "../../components/Button";
import ServiceInput from '../../components/ServiceInput';
import Proposal from "../../models/Proposal";

export default class Services extends React.Component {


    proposal = new Proposal();

    nextPage = () => {
        this.proposal.save();
    };

    toggleProp = (propertyName) => {
        this.proposal[propertyName] = !this.proposal[propertyName];


        console.log(this.proposal);
    };

    render() {
        return (
            <View style={textStyle.rootViewWrapper}>

                <ScrollView>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: 'wrap',
                        width: 320,
                        marginTop: 10
                    }}>
                        <ServiceInput text="Флористика" onPress={() => this.toggleProp('floristics')}/>
                        <ServiceInput text="Оформление зала" onPress={() => this.toggleProp('hall')}/>
                        <ServiceInput text="Фото и видео" onPress={() => this.toggleProp('photo')}/>
                        <ServiceInput text="Стилисты" onPress={() => this.toggleProp('stylists')}/>
                        <ServiceInput text="Торты" onPress={() => this.toggleProp('cake')}/>
                        <ServiceInput text="Транспорт" onPress={() => this.toggleProp('transport')}/>
                        <ServiceInput text="Развлекательная программа"
                                      onPress={() => this.toggleProp('entertainment')}/>
                        <ServiceInput text="Подарки" onPress={() => this.toggleProp('present')}/>
                        <ServiceInput text="Парковка" onPress={() => this.toggleProp('parking')}/>
                        <ServiceInput text="Отдельный зал" onPress={() => this.toggleProp('private')}/>
                        <ServiceInput text="Танцпол" onPress={() => this.toggleProp('dance')}/>
                        <ServiceInput text="Свой алкоголь" onPress={() => this.toggleProp('own_alcohol')}/>
                    </View>
                </ScrollView>
                <View style={{width: '100%'}}>
                    <Button
                        title="Продолжить"
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        )
    }

}