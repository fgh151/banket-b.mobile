import trackEvent from "../helpers/AppsFlyer";
import Client from '../http/Client';
import * as ArrayHelper from "../helpers/ArrayHelper";
import {Actions} from "react-native-router-flux";
import AS from '@react-native-community/async-storage'
import React from "react";
import {City} from "../helpers/GeoLocation";
import {MIN_AMOUNT, MIN_GUEST_COUNT, STORAGE_AUTH_TOKEN} from "../helpers/Constants";
import log from "../helpers/firebaseAnalytic";

export default class Proposal {

    static instance;
    city_id = (new City()).id; // 1; //Москва
    event_type = null;
    date = null;
    time = null;
    guests_count = 0;
    amount = 0;
    comment = '';
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
    metro = null;


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
        return types[typeId - 1];
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
                return value !== null;
            }
            case 'time' : {
                return value !== null;
            }
            case 'date' : {
                //Запрет выбора меньшей даты
                return value !== null;
            }
            case 'guests_count' : {
                return this.countValid(value, MIN_GUEST_COUNT) ? true : 'Минимальное количество гостей ' + MIN_GUEST_COUNT;
            }
            case 'amount' : {
                return this.countValid(value, MIN_AMOUNT) ? true : 'Минимальная стоимость ' + MIN_AMOUNT + ' рублей';
            }
            case 'comment' : {
                return true;
            }
        }
    }

    /**
     *
     * @returns {boolean}
     */
    validate() {
        return this.city_id !== null &&
            this.event_type !== null &&
            this.date !== null &&
            this.time !== null &&
            this.countValid(this.guests_count, MIN_GUEST_COUNT) &&
            this.countValid(this.amount, MIN_AMOUNT);
    }

    countValid(count, assert) {
        return parseInt(count) >= assert;
    }

    afterSave(proposal) {
        trackEvent('proposal', {proposal: this});
        this.clear();

        AS.setItem('p_' + proposal.id, '0');

        Actions.Finish({proposal: proposal});
        log(this, 'save_proposal');
    }

    save() {
        AS.getItem(STORAGE_AUTH_TOKEN)
            .then((result) => {

                if (result === null) {
                    Actions.RegisterPhone();
                } else {

                    this.saveWithToken(result);
                }
            }).catch((e) => console.log('cathc', e));
    }

    saveWithToken(token) {
        const api = new Client(token);
        api.POST('/v2/proposal/create', this)
            .then(response => {
                if (response.hasOwnProperty('id')) {
                    this.afterSave(response);
                } else {
                    let keys = ArrayHelper.getKeys(response);
                    keys.forEach((val) => {
                        this.errors.push(response[val].join('; '))
                    })
                }
            });
    }
}
