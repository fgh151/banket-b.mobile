package ru.banket_b.mobile;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "rubanketb";
    }

    @Override
    public void onNewIntent(Intent intent) {
        SplashScreen.show(this, R.style.SplashTheme);  // here
        super.onNewIntent(intent);
        setIntent(intent);
    }
}
