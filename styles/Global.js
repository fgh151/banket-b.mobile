import {StyleSheet} from 'react-native';


export const Styles = StyleSheet.create({
    defaultFont: {
        fontFamily: "Lato-Regular",
        fontSize:18,
    },
    boldFont: {
        fontFamily: "Lato-Bold",
        fontSize:18,
    },
    navBar: {
        elevation: 0,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    },
    rootViewWrapper: {
        flex: 1,
        flexDirection: 'column',
        padding:15,
        alignItems: 'center',

    },
    rootView: {
        maxWidth: 300,
        width:'100%'
    },
    rootViewBig: {
        maxWidth: 400,
        width:'100%'
    },
    grayText: {
        color: 'rgba(0,0,0,0.5)'
    },


});

