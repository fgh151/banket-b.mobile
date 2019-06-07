import React from 'react';

import {StyleSheet} from "react-native";

export default class FormPage extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    setProposalProperty(propertyName, value) {
        let valid = this.proposal.validateProperty(propertyName, value);
        let errorProp = propertyName + '_error';
        let state = {};

        this.proposal[propertyName] = value;
        this.setState(this.proposal);

        if (valid === true) {
            state[errorProp] = '';
            if (this.proposal.validate()) {
                state['buttonDisabled'] = false;
            }
        } else {
            state['buttonDisabled'] = true;
            state[errorProp] = valid;
        }

        this.setState(state);
    }


    _scrollToInput(reactNode: any) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }
}

export var commonStyles = StyleSheet.create({
    contentContainerStyle: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
    },
});