import DeviceInfo from "react-native-device-info";


export default class GlobalState {
    static instance;

    BattleList = null;
    DialogList = null;

    AuthCode = null;

    Uid = DeviceInfo.getUniqueID();
    userId = null;

    /**
     *
     * @returns GlobalState
     */
    constructor() {
        if (GlobalState.instance) {
            return GlobalState.instance;
        }

        GlobalState.instance = this;


        console.log('uid', this.Uid);
    }
}