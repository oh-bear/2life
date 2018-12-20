package me.ursb.twolife;

import android.app.Application;


import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.imagepicker.ImagePickerPackage;
import com.dooboolab.RNIap.RNIapPackage;

//import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import cn.jpush.reactnativejpush.JPushPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.theweflex.react.WeChatPackage;

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
            return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new RNFSPackage(),
            new RNViewShotPackage(),
            new FingerprintAuthPackage(),
            new LinearGradientPackage(),
            //new ExtraDimensionsPackage(),
                    new RandomBytesPackage(),
                    new RNFetchBlobPackage(),
                    new VectorIconsPackage(),
                    new SvgPackage(),
                    new SplashScreenReactPackage(),
                    new ImagePickerPackage(),
                    new RNIapPackage(),
                    new WeChatPackage(),
                    new JPushPackage(true, true));
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
