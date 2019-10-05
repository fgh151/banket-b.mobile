import React from 'react';
import {Styles, windowPadding} from "../../styles/Global";
import {Text, View} from "react-native";


export default class CardItem extends React.PureComponent {
    render() {
        return (
            <View style={{
                padding: windowPadding,
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                <View style={{marginBottom: 5}}>
                    <Text style={[Styles.boldFont, {fontSize: 15, lineHeight: 18, marginBottom: 5}]}>
                        {this.props.title}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignSelf: 'auto',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    {this.props.content}
                </View>
            </View>
        )
    }
}