import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';


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

export default class GeoLocation {

    constructor() {
        console.log("geolocation constructor");

        this.getLocation();
    }


    getLocation() {
        console.log("get location");


        Geolocation.getCurrentPosition(
            (position) => {

                // position = {
                //     "coords": {
                //         "speed": -1,
                //         "longitude": -122.406417,
                //         "latitude": 37.785834,
                //         "accuracy": 5,
                //         "heading": -1,
                //         "altitude": 0,
                //         "altitudeAccuracy": -1
                //     }, "timestamp": 1548078506866.419
                // };

                console.log("position");
                console.log(JSON.stringify(position));

                var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }

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


                    console.log("Geo coder");
                    console.log(JSON.stringify(res));

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