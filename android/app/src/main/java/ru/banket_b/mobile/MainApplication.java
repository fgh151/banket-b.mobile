package ru.banket_b.mobile;

import android.app.Application;

import com.RNTextInputMask.RNTextInputMaskPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.wheelpicker.WheelPickerPackage;

import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

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
                    new RNTextInputMaskPackage(),
                    new SplashScreenReactPackage(),
                    new RNFusedLocationPackage(),
                    new RNGeocoderPackage(),
                    new RNAppsFlyerPackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNFirebaseDatabasePackage(),
                    new WheelPickerPackage(),
                    new AndroidKeyboardAdjustPackage(),
                    new AsyncStoragePackage(),
                    new NetInfoPackage(),
                    new RNFirebaseInstanceIdPackage(),
                    new RNFirebaseCrashlyticsPackage(),
                    new RNFirebaseAnalyticsPackage()
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
