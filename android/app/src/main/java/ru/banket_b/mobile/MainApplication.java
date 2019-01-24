package ru.banket_b.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;

import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.sentry.RNSentryPackage;

import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.appsflyer.reactnative.RNAppsFlyerPackage;


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNFirebasePackage(),
                    new FIRMessagingPackage(),
                    new RNSentryPackage(),
                    new RNAppsFlyerPackage(MainApplication.this),
                    new RNGeocoderPackage(),
                    new RNFusedLocationPackage(),
                    new RNFirebaseMessagingPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
