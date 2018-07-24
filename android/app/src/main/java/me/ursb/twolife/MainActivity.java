package me.ursb.twolife;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;

import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import android.os.Bundle;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

//        window.setBackgroundDrawableResource(R.drawable.main_bg);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            Window window = getWindow();
            window.setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS,
                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);

        }

        //SplashScreen.show(this);
        ReactContext ctx = getReactInstanceManager().getCurrentReactContext();
        if(ctx == null) {
            SplashScreen.show(this);
        }

    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "twolife";
    }
}
