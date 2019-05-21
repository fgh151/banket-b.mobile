import Client from '../http/Client';
import GlobalState from "../models/GlobalState";

export const OPEN_APP_EVENT = 'open-app';
export const CREATE_BTN_CLICK = 'create-btn-click';
export const GOTO_SERVICES = 'go-to-services';
export const GOFROM_SERVICE = 'go-from-service';
export const GOFROM_REGISTER = 'go-from-register';
export const CONFIRM_REGISTER = 'confirm-register';
export const BATTLE_CREATED = 'battle-created';
export const CHAT_ENTER = 'chat-enter';
export const CHAT_ANSWER = 'chan-answer';

class Funnel {
    client = null;

    constructor() {
        this.client = new Client();
    }

    catchEvent(event, extra = {}) {
        var gs = new GlobalState();
        try {
            this.client.POST('/v2/funnel', {
                event: event,
                uid: gs.Uid,
                userId: gs.userId,
                extra: extra
            })

        } catch (e) {
            console.log(e)
        }
    }
}

export const funnel = new Funnel();