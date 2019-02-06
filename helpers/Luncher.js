import {AsyncStorage} from "react-native";


const STORAGE_KEY = "battle@firstLunch";

/**
 * @returns {Promise<any>}
 */
export function isFirstLunch() {
    return AsyncStorage.getItem(STORAGE_KEY);
}

/**
 *
 * @returns {Promise}
 */
export function firstLunchDone() {
    return AsyncStorage.setItem(STORAGE_KEY, true.toString());
}

/**
 * @returns {Promise}
 */
export function firstLunchRevert() {
    return AsyncStorage.removeItem(STORAGE_KEY);
}