package me.ursb.twolife.wxapi;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import com.theweflex.react.WeChatModule;

public class WXEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}

