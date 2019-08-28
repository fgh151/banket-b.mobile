import EventBus from "eventing-bus";
import AS from "@react-native-community/async-storage";
import Push from "./Push";

export class Notify {
    static readAllMessages(proposal, organization, count) {
        EventBus.publish(proposal + organization + 'read');
        EventBus.publish('proposal_read');
        AS.setItem(proposal + organization, count.toString());
        Push.clearNotifications();
    }
}
