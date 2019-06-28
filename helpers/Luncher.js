import AS from '@react-native-community/async-storage'
import {STORAGE_FIRST_LUNCH} from "./Constants";


/**
 * @returns {Promise<any>}
 */
export function isFirstLunch() {
    return AS.getItem(STORAGE_FIRST_LUNCH);
}

/**
 *
 * @returns {Promise}
 */
export function firstLunchDone() {
    return AS.setItem(STORAGE_FIRST_LUNCH, true.toString());
}

/**
 * @returns {Promise}
 */
export function firstLunchRevert() {
    return AS.removeItem(STORAGE_FIRST_LUNCH);
}