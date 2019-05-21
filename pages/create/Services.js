import React from "react";

import ReactNative, {View} from "react-native"
import {Styles as textStyle} from "../../styles/Global";
import {Button} from "../../components/Button";
import ServiceInput from '../../components/ServiceInput';
import Proposal from "../../models/Proposal";
import AdditionalInput from './AdditionalInput'

import FormPage, {commonStyles} from './AbstractFormPage';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {funnel, GOFROM_SERVICE} from "../../components/Funnel";

export default class Services extends FormPage {

    state = {
        buttonDisabled: false
    };

    proposal = new Proposal();

    nextPage = () => {

        funnel.catchEvent(GOFROM_SERVICE);
        this.setState({buttonDisabled: true});
        this.proposal.save()
    };

    toggleProp = (propertyName) => {
        this.proposal[propertyName] = !this.proposal[propertyName];


        console.log(this.proposal);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

        this.setState({buttonDisabled: false})
    }

    render() {

        // if (Platform.OS === 'android') {
        //     AndroidKeyboardAdjust.setAdjustPan();
        // }
        return (
            <View style={textStyle.rootViewWrapper}>

                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    contentContainerStyle={commonStyles.contentContainerStyle}
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: 'wrap',
                        maxWidth: 320,
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
                        <AdditionalInput
                            onChangeText={(notes) => {
                                this.setProposalProperty('notes', notes);
                                this.setState({notes: notes});
                            }}
                            value={this.state.notes}
                            onHeightChange={(newHeight) => this._scrollToInput(ReactNative.findNodeHandle(this.marker))}
                            onFocus={() => this.setState({hideButton: true})}
                            onBlur={() => this.setState({hideButton: false})}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <View style={{width: '100%'}}>
                    <Button
                        title="Продолжить"
                        disabled={this.state.buttonDisabled}
                        onPress={this.nextPage}
                    />
                </View>
            </View>
        )
    }

}
