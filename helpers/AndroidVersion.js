'use strict';

const NativeModules = require('NativeModules');

export default class AndroidVersion {
    OS = 'android';
    static get Version() {
        const constants = NativeModules.PlatformConstants;
        return constants && constants.Version;
    }

    static select = (obj: Object) => {
        const version = AndroidVersion.Version;
        const moreVersion = '>=' + version;
        return version in obj ? obj[version] : moreVersion in obj ? obj[moreVersion] : obj.default
    }
}