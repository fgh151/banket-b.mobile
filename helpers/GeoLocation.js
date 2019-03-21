import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, AsyncStorage} from "react-native";
import Client from '../http/Client';


const Position = {
    "timestamp": 1484669056399.49,
    "coords": {
        "accuracy": 5,
        "altitude": 0,
        "altitudeAccuracy": -1,
        "heading": -1,
        "latitude": 37.785834,
        "longitude": -122.406417,
        "speed": -1
    }
};

const geoCoder = {
    position: {lat: String, lng: String},
    formattedAddress: String, // the full address
    feature: String | null, // ex Yosemite Park, Eiffel Tower
    streetNumber: String | null,
    streetName: String | null,
    postalCode: String | null,
    locality: String | null, // city name
    country: String,
    countryCode: String,
    adminArea: String | null,
    subAdminArea: String | null,
    subLocality: String | null
};

let hasPermission;

export class City {
    static instance;
    //По умолчанию Москва
    id = 1;
    city = {
        districts: [],
        id: 1,
        metro: [],
        title: "Москва"
    };
    constructor() {
        if (City.instance) {
            return City.instance;
        }
        City.instance = this;
    }
}

export default class GeoLocation {
    static CACHE_KEY = 'geo-base';
    city = new City();

    constructor() {
        this.requestLocationPermission();
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Банкет батл",
                    message: "Поиск лучшего места для банкета"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log("You can use the location");

                this.getLocation();

                // alert("You can use the location");
            } else {
                console.log("location permission denied");
                // alert("Location permission denied");
            }
        } catch (err) {
        }
    }

    findInRemote(cityName) {


        GeoLocation.getRemoteCities()
            .then(
                (responseData) => {
                    AsyncStorage.setItem(GeoLocation.CACHE_KEY, responseData);
                    let c = responseData.find((cityObject) => cityObject.title === cityName);
                    if (c) {
                        // console.log(c);
                        this.city.id = c.id;
                        this.city.city = c;
                    }

                }
            )
    }

    static getRemoteCities() {
        const api = new Client();
        return api.GET('/city/city')
    }

    getLocation() {
        Geolocation.getCurrentPosition(
            (position) => {

                var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                Geocoder.geocodePosition(location).then(res => {
                    // res is an Array of geocoding object (see below)


                    // res = [{
                    //     "subAdminArea": "San Francisco",
                    //     "position": {"lng": -122.406417, "lat": 37.785834},
                    //     "feature": "1 Stockton St",
                    //     "subLocality": "Union Square",
                    //     "adminArea": "CA",
                    //     "countryCode": "US",
                    //     "streetName": "Stockton St",
                    //     "formattedAddress": "1 Stockton St, San Francisco, CA  94108, United States",
                    //     "postalCode": "94108",
                    //     "streetNumber": "1",
                    //     "country": "United States",
                    //     "locality": "San Francisco"
                    // }];


                    // console.log("Geo coder");
                    // console.log(JSON.stringify(res));
                    this.findInRemote(res.locality);

                })

            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    }
}