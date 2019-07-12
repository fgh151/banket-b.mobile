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

/**
 *
 * @param {Array} obj1
 * @param {Array} obj2
 * @returns {*}
 */
export function merge(obj1, obj2) {
    for (let p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor === Object) {
                obj1[p] = merge(obj1[p], obj2[p]);

            } else {
                obj1[p] = obj2[p];
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}

/**
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {boolean}
 */
export function isEqual(a, b) {
    // if the other array is a falsy value, return
    if (!b)
        return false;
    // isEqual lengths - can save a lot of time
    if (
        a.length !==
        b.length
    )
        return false;

    for (let i = 0, l = a.length; i < l; i++) {
        // Check if we have nested arrays
        if (a[i] instanceof Array && b[i] instanceof Array) {
            // recurse into the nested arrays
            if (!isEqual(a[i], b[i]))
                return false;
        } else if (a[i] !== b[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}