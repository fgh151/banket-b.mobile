import {firebase} from "../Config";


export default class GlobalState {
    static instance;

    AuthCode = null;
    Uid = null;
    userId = null;

    /**
     *
     * @returns GlobalState
     */
    constructor() {
        if (GlobalState.instance) {
            return GlobalState.instance;
        }

        firebase.iid().get().then((iid) => this.Uid = iid);
        GlobalState.instance = this;
    }
}
