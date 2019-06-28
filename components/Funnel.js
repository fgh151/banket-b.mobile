import Client from '../http/Client';
import GlobalState from "../models/GlobalState";

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