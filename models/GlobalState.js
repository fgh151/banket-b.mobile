



export default class GlobalState {
    static instance;

    BattleList = null;
    DialogList = null;

    constructor() {
        if (GlobalState.instance) {
            return GlobalState.instance;
        }

        GlobalState.instance = this;
    }
}