import BackButton from './BackButton';
import {Actions} from "react-native-router-flux";
import {BACK_TO_FORM_EVENT} from '../helpers/Constants'
import EventBus from "eventing-bus";

export default class BackFromRegister extends BackButton {

    backAction = () => {

        EventBus.publish(BACK_TO_FORM_EVENT);
        Actions.Services({fromReg: true});
    }
}