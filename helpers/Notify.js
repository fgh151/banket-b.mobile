import EventBus from "eventing-bus";
import * as ArrayHelper from "./ArrayHelper";
import {db} from "../Config";


export class Notify {
    static instance;


    messageStat = [];

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


    subscribeOnMessages(userId: number) {
        const path = '/proposal_2/u_' + userId;
        let ref = db.ref(path);
        ref.on('value', (snapshot) => {
            const value = snapshot.val();
            let proposals = ArrayHelper.getKeys(value);
            proposals.forEach((index) => this._subscribeProposal(index, path));
        });
    }

    _subscribeProposal = (proposalIndex, path) => {
        let proposalPath = path + '/' + proposalIndex;
        db.ref(proposalPath).once('value', (snapshot) => {
            /**
             * {"o_1": {"123":{message}}}
             */
            let proposalValues = snapshot.val();
            ArrayHelper.getKeys(proposalValues).forEach((organizationIndex, index, arr) => {
                this._subscribeOrganizationMessage(proposalPath, organizationIndex, proposalIndex, proposalValues)
            });
        });
    };

    _subscribeOrganizationMessage(proposalPath, organizationIndex, proposalIndex, proposalValues) {
        let organizationPath = proposalPath + '/' + organizationIndex;
        let organizationRef = db.ref(organizationPath);
        organizationRef.once('value', (snapshot, messageAddedIndex) => {
            if (messageAddedIndex !== null) {
                EventBus.publish(proposalIndex); //ProposalListItem
                EventBus.publish(proposalIndex + organizationIndex); //DialogListItem
                EventBus.publish(proposalIndex + organizationIndex, proposalValues[organizationIndex]); //Messenger
            }
        });
    }


    _sendMessageEvent(proposal, organization, messages) {

        EventBus.publish(proposal); //ProposalListItem
        EventBus.publish(proposal + organization); //DialogListItem
        EventBus.publish(proposal + organization, messages); //Messenger


        console.log('messages', messages);

        this.saveStatistic(proposal, organization, messages)
    }

    saveStatistic(proposal: string, organization: string, messages: Array) {
        // let stat = {};
        // stat[organization] = messages.length;
        if (messages !== undefined) {
            this.messageStat[proposal][organization] = messages.length;
        }

        console.log('new stat', this.messageStat)
    }


    /**
     *
     * @param proposalIndex
     * @returns {NotifyStorage}
     */
    getValuesForProposal(proposalIndex) {
        let tmp = new NotifyStorage();
        tmp.cnt = 90;
        tmp.read = 90;
        return tmp;
    }

    /**
     *
     * @param proposalIndex
     * @param organizationIndex
     * @returns {NotifyStorage}
     */
    getValuesForOrganization(proposalIndex, organizationIndex) {
        let tmp = new NotifyStorage();
        tmp.cnt = 90;
        tmp.read = 90;
        return tmp;
    }

    setSendNotifyForProposal(proposalIndex, send = true) {
    }


}

export class NotifyStorage {
    cnt;
    read;
}