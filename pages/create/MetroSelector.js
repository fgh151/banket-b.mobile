import React from "react";
import {StyleSheet, View} from "react-native";
import SearchableDropDown from "../../components/SearchableDropDown";
import {Actions} from "react-native-router-flux";
import {sortByTitle} from "../../helpers/ArrayHelper";
import Moscow from "../../models/City";

export default class MetroSelector extends React.Component {

    render() {

        let city = Moscow;

        if (city.hasOwnProperty('metro') && city.metro.length > 0) {

            let stations = city.metro.sort(sortByTitle);
            stations.unshift(
                {
                    "id": null,
                    "title": "Любое метро",
                    "color": "ffffff"
                }
            );

            return (
                <View>
                    <View style={{height: 'auto'}}>
                        <SearchableDropDown
                            style={{backgroundColor: 'red'}}
                            items={stations}
                            textInputProps={
                                {
                                    placeholder: "Искать",
                                    underlineColorAndroid: "transparent",
                                    style: style.textInput,
                                    autoFocus: true
                                }
                            }
                            itemTextStyle={style.itemText}
                            itemStyle={style.item}
                            onItemSelect={(item) => {
                                this.props.onSelect(item);
                                Actions.popTo('Form');
                            }}
                            listProps={{nestedScrollEnabled: true}}
                        />
                    </View>
                </View>
            )
        }
        return null;
    }
}

const style = StyleSheet.create({
    textInput: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    itemText: {
        fontSize: 15,
        lineHeight: 50
    },
    item: {
        borderColor: '#E0E0E0',
        borderBottomWidth: 1,
        marginLeft: 15,
        marginRight: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
