import trackEvent from "../helpers/AppsFlyer";
import Client from '../http/Client';
import * as ArrayHelper from "../helpers/ArrayHelper";
import {Actions} from "react-native-router-flux";
import {AsyncStorage} from "react-native";
import React from "react";
import {City} from "../helpers/GeoLocation";


const MIN_GUEST_COUNT = 1;
const MIN_AMOUNT = 100;

export default class Proposal {

    static instance;
    cityId = (new City()).id; // 1; //Москва
    event_type = 7;
    date = null;
    time = null;
    guests_count = 0;
    amount = 0;
    notes = '';
    errors = [];
    floristics = false;
    hall = false;
    photo = false;
    stylists = false;
    cake = false;
    entertainment = false;
    transport = false;
    present = false;

    //Back compability props
    type = 1;
    cuisine = 1;


    constructor() {
        if (Proposal.instance) {
            return Proposal.instance;
        }

        Proposal.instance = this;
    }

    static getEventTypeNames(typeId) {
        const types = [
            "Банкет",
            "Корпоратив",
            "Детский праздник",
            "День рождения",
            "Юбилей",
            "Свадьба",
            "Другое",
        ];
        return types[typeId -1];
    }

    clear() {
        Proposal.instance = null;
    }

    /**
     * @param property
     * @param value
     * @returns {boolean|string}
     */
    validateProperty(property: string, value: any) {
        switch (property) {
            case 'event_type' : {
                return true;
            }
            case 'time' : {
                return true;
            }
            case 'date' : {
                //Запрет выбора меньшей даты
                return true;
            }
            case 'guests_count' : {
                return this.countValid(value, MIN_GUEST_COUNT) ? true : 'Минимальное количество гостей ' + MIN_GUEST_COUNT;
            }
            case 'amount' : {
                return this.countValid(value, MIN_AMOUNT) ? true : 'Минимальная стоимость ' + MIN_AMOUNT;
            }
        }
    }

    /**
     *
     * @returns {boolean}
     */
    validate() {
        return this.cityId !== null && this.event_type !== null && this.date !== null && this.time !== null && this.countValid(this.guests_count, MIN_GUEST_COUNT) && this.countValid(this.amount, MIN_AMOUNT);
    }

    countValid(count, assert) {
        return parseInt(count) >= assert;
    }

    afterSave() {
        trackEvent('proposal', {proposal: this});
        this.clear();
        Actions.Finish();
    }

    save() {
        AsyncStorage.getItem('battle@token')
            .then((result) => {
                if (result === null) {
                    Actions.Register();
                } else {
                    const api = new Client(result);
                    api.POST('/proposal/create', this)
                        .then(response => {
                            if (ArrayHelper.isEmpty(response)) {
                                this.afterSave();
                            } else {
                                let keys = ArrayHelper.getKeys(response);
                                keys.forEach((val) => {
                                    this.errors.push(response[val].join('; '))
                                })
                            }
                        });

                }
            });
    }
}
