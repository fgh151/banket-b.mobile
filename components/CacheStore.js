'use strict';

import AS from '@react-native-community/async-storage'

// Inspired by lscache https://github.com/pamelafox/lscache

const CACHE_PREFIX = 'cachestore-';
const CACHE_EXPIRATION_PREFIX = 'cacheexpiration-';
const EXPIRY_UNITS = 60 * 1000; // Time resolution in minutes

function currentTime() {
    return Math.floor((new Date().getTime()) / EXPIRY_UNITS);
};

const CacheStore = {
    get(key) {
        const theKey = CACHE_PREFIX + key;
        const exprKey = CACHE_EXPIRATION_PREFIX + key;
        return AS.getItem(exprKey).then((expiry) => {
            if (expiry && currentTime() >= parseInt(expiry, 10)) {
                AS.multiRemove([exprKey, theKey]);
                return new Promise.reject(null);
            }
            return AS.getItem(theKey).then((item) => {
                return Promise.resolve(JSON.parse(item));
            });
        });
    },

    set(key, value, time) {
        const theKey = CACHE_PREFIX + key;
        const exprKey = CACHE_EXPIRATION_PREFIX + key;
        if (time) {
            return AS.setItem(exprKey, (currentTime() + time).toString()).then(() => {
                return AS.setItem(theKey, JSON.stringify(value));
            });
        } else {
            AS.removeItem(exprKey);
            return AS.setItem(theKey, JSON.stringify(value));
        }
    },

    remove(key) {
        return AS.multiRemove([CACHE_EXPIRATION_PREFIX + key, CACHE_PREFIX + key]);
    },

    isExpired(key) {
        const exprKey = CACHE_EXPIRATION_PREFIX + key;
        return AS.getItem(exprKey).then((expiry) => {
            var expired = expiry && currentTime() >= parseInt(expiry, 10);
            return expired ? Promise.resolve() : new Promise.reject(null);
        });
    },

    flush() {
        return AS.getAllKeys().then((keys) => {
            var theKeys = keys.filter((key) => {
                return key.indexOf(CACHE_PREFIX) == 0 || key.indexOf(CACHE_EXPIRATION_PREFIX) == 0;
            });
            return AS.multiRemove(theKeys);
        });
    },

    flushExpired() {
        return AS.getAllKeys().then((keys) => {
            keys.forEach((key) => {
                if (key.indexOf(CACHE_EXPIRATION_PREFIX) == 0) {
                    var exprKey = key;
                    return AS.getItem(exprKey).then((expiry) => {
                        if (expiry && currentTime() >= parseInt(expiry, 10)) {
                            var theKey = CACHE_PREFIX + key.replace(CACHE_EXPIRATION_PREFIX, '');
                            return AS.multiRemove([exprKey, theKey]);
                        }
                        return Promise.resolve();
                    });
                }
                return Promise.resolve();
            });
        });
    }
};

// Always flush expired items on start time
CacheStore.flushExpired();

export default CacheStore;
