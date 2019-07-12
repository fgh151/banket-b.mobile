import config from '../Config';
import NetInfo from "@react-native-community/netinfo";
import GlobalState from "../models/GlobalState";

export default class Client {

    constructor(authToken, baseUrl = '', {headers = {}} = {}) {
        this.headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        };
        Object.assign(this.headers, headers);
        this.baseUrl = config.apiUrl; // baseUrl;
    }

    login(phone, code) {
        // Returns a Promise with the response.
        return this.POST('/v2/auth/index', {phone: phone, code: code});
    }

    static sendCode(params: Object): void {
        const api = new Client();
        api.POST('/v2/auth/sendcode', params)
            .then(response => {
                if (response.hasOwnProperty('code')) {
                    let state = new GlobalState();
                    state.AuthCode = response.code;
                }
            })
    }

    static sendRegisterCode(params: Object): void {
        const api = new Client();
        api.POST('/v2/auth/sendregistercode', params)
            .then(response => {
                if (response.hasOwnProperty('code')) {
                    let state = new GlobalState();
                    state.AuthCode = response.code;
                }
            })
    }

    getCurrentUser() {
        // If the request is successful, you can return the expected object
        // instead of the whole response.
        return this.GET('/auth')
            .then(response => response.user);
    }

    _fullRoute(url) {
        return `${this.baseUrl}${url}`;
    }

    _fetch(route, method, body, isQuery = false, debugInfo = '') {

        if (!route) throw new Error('Route is undefined');
        let fullRoute = this._fullRoute(route);


        if (isQuery && body) {
            let qs = require('qs');
            const query = qs.stringify(body);
            fullRoute = `${fullRoute}?${query}`;
            body = undefined;
        }
        let opts = {
            method,
            headers: this.headers
        };
        if (body) {
            Object.assign(opts, {body: JSON.stringify(body)});
        }


        return this.onlineFetch(fullRoute, opts, debugInfo);

    }

    onlineFetch(fullRoute, opts, debugInfo = '') {
        const fetchPromise = () => fetch(fullRoute, opts);
        return NetInfo.fetch().then((connectionInfo) => {


            // console.log(connectionInfo.type);

            // if (connectionInfo.type !== 'none') {
            return fetchPromise()
                .then(response => {
                    // console.log(debugInfo, fullRoute, response);
                    return response.json()
                })
            // }
            // return {};
        });
    }


    GET(route, query, debugInfo = '') {
        return this._fetch(route, 'GET', query, true, debugInfo);
    }

    POST(route, body) {
        return this._fetch(route, 'POST', body);
    }

    PUT(route, body) {
        return this._fetch(route, 'PUT', body);
    }

    DELETE(route, query) {
        return this._fetch(route, 'DELETE', query, true);
    }
};
