import EventBus from "eventing-bus";
import AS from "@react-native-community/async-storage";
import Push from "./Push";

export class Notify {
    static instance;

    /**
     *
     * @returns Notify
     */
    constructor() {
        if (Notify.instance) {
            return Notify.instance;
        }
        Notify.instance = this;
    }

    readAllMessages(proposal, organization, count) {
        EventBus.publish(proposal + organization + 'read');
        EventBus.publish('proposal_read');
        AS.getItem(proposal).then((cnt) => {
            if (cnt === null) {
                cnt = 0;
            } else {
                //Прочитано в заявке
                cnt = parseInt(cnt);
            }
            AS.getItem(proposal + organization).then((oldValue) => {
                //прочитано в заявке у ресторана
                oldValue = parseInt(oldValue);
                if (oldValue === null) {
                    count = count.toString();
                    //новое значение в заявке
                    cnt = cnt - oldValue + count;
                } else {
                    cnt = count;
                }
                AS.setItem(proposal, cnt.toString());
                AS.setItem(proposal + organization, count.toString());

                Push.clearNotifications();
            })
        })
    }
}
