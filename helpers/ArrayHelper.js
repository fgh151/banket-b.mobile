/**
 * Remove element from array by it value
 * @param arr
 * @returns {Array}
 */
export function removeA(arr) {
    let what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

/**
 * Serialize object to url encoded string
 * @param obj
 * @returns {string}
 */
export function serialize(obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            if (obj[p] != null) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
    return str.join("&");
}

/**
 * Get kyes of array
 * @param obj
 * @returns {Array}
 */
export function getKeys(obj) {
    let keys = [];
    for (let key in obj) {
        // noinspection JSUnfilteredForInLoop
        keys.push(key);
    }
    return keys;
}

/**
 * Is empty object
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (let key in obj) {
        // noinspection JSUnresolvedVariable
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


export function messagesObject2array(obj) {
    let result = [];
    const keys = getKeys(obj);
    keys.forEach(function (item) {
        let message = obj[item];
        message['key'] = item;
        result.push(message)
    });
return result;
}