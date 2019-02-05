
import moment from "moment";
import trackEvent from "../helpers/AppsFlyer";
import Client from '../http/Client';
import * as ArrayHelper from "../helpers/ArrayHelper";

export default class Proposal{

    now = moment();

    city = "Москва";
    cityId = 78;

    date= this.now.format('YYYY-MM-DD');
    time = this.now.format('HH:mm');
    guests_count = '5';
    amount = '3000';



    errors = [];

    validate() {

        return ArrayHelper.isEmpty(this.errors);
    }

    afterSave() {
        trackEvent('proposal', {proposal: this});
    }

    save() {
        let isValid = this.validate();
        if (isValid) {
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
    }
}