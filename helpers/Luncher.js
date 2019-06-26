import AS from '@react-native-community/async-storage'


const STORAGE_KEY = "battle@firstLunch";

/**
 * @returns {Promise<any>}
 */
export function isFirstLunch() {
    return AS.getItem(STORAGE_KEY);
}

/**
 *
 * @returns {Promise}
 */
export function firstLunchDone() {
    return AS.setItem(STORAGE_KEY, true.toString());
}

/**
 * @returns {Promise}
 */
export function firstLunchRevert() {
    return AS.removeItem(STORAGE_KEY);
}