import {fa} from "../Config";

export default function log(object: Object, event: string, params?: Object) {
    fa.logEvent(object.constructor.name + '_' + event, params);
}
