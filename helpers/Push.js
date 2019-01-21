import {Notifications, Permissions} from 'expo';
import config from '../Config';
import {AsyncStorage} from "react-native";
import Client from '../http/Client';


export default class Push {

    url = config.apiUrl + '/api/v2/push';

    async registerForPushNotificationsAsync() {
        const {status: existingStatus} = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        return AsyncStorage.getItem('battle@id')
            .then((userId) => {
                const api = new Client();
                api.POST(this.url, {
                    token: token,
                    user:  userId
                })
            })
    }
}