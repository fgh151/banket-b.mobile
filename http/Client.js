import config from '../Config';
import {NetInfo} from 'react-native';

export default class Client {

    constructor(authToken, baseUrl = '', {headers = {}, devMode = false, simulatedDelay = 0} = {}) {
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

    getCurrentUser() {
        // If the request is successful, you can return the expected object
        // instead of the whole response.
        return this.GET('/auth')
            .then(response => response.user);
    }

    _fullRoute(url) {
        return `${this.baseUrl}${url}`;
    }

    _fetch(route, method, body, isQuery = false) {

        if (!route) throw new Error('Route is undefined');
        let fullRoute = this._fullRoute(route);

        console.log(fullRoute);

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


        return this.onlineFetch(fullRoute, opts);

    }

    onlineFetch(fullRoute, opts) {
        const fetchPromise = () => fetch(fullRoute, opts);
        return NetInfo.getConnectionInfo().then((connectionInfo) => {


            console.log(connectionInfo.type);

            // if (connectionInfo.type !== 'none') {
                return fetchPromise()
                    .then(response => {console.log(response); return response.json()})
            // }
            // return {};
        });
    }


    GET(route, query) {
        return this._fetch(route, 'GET', query, true);
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
