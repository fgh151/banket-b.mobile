import DeviceInfo from "react-native-device-info";
import EventBus from "eventing-bus";
import {BUS_CLEAR_NOTIFICATIONS, BUS_MESSAGE_READ_EVENT, BUS_NEW_MESSAGE_EVENT} from "../helpers/Constants";
import * as ArrayHelper from "../helpers/ArrayHelper";
import {NewMessageEventParams} from "./NewMessageEventParams";

export default class GlobalState {
    static instance;

    BattleList = null;
    DialogList = null;

    AuthCode = null;

    Uid = DeviceInfo.getUniqueID();
    userId = null;

    /**
     * Идентификаторы заявок с новыми сообщениями
     * @type {Array}
     */
    newMessagesInProposal = [];

    /**
     * Массив новых сообщений в диалогах
     * Формат proposalId-organizationId
     * @type {Array}
     */
    newMessagesInDialogs = [];

    /**
     *
     * @returns GlobalState
     */
    constructor() {
        if (GlobalState.instance) {
            return GlobalState.instance;
        }

        GlobalState.instance = this;

        EventBus.on(BUS_NEW_MESSAGE_EVENT, (data: NewMessageEventParams) => {
            console.log('eb recieve gs', this);
            this.newMessagesInProposal.push(data.proposalId);
            this.newMessagesInDialogs.push(data.proposalId + '-' + data.organizationId);
        });

        EventBus.on(BUS_MESSAGE_READ_EVENT, (data: NewMessageEventParams) => {
            ArrayHelper.removeA(this.newMessagesInProposal, data.proposalId.toString());
            ArrayHelper.removeA(this.newMessagesInDialogs, data.proposalId + '-' + data.organizationId);
            if (ArrayHelper.isEmpty(this.newMessagesInDialogs) && ArrayHelper.isEmpty(this.newMessagesInProposal)) {
                EventBus.publish(BUS_CLEAR_NOTIFICATIONS);
            }
        });
    }
}
