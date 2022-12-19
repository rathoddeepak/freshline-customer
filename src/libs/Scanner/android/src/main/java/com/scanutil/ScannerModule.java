package com.scanutil;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.ActivityResultCallback;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.g00fy2.quickie.ScanQRCode;
import com.g00fy2.quickie.QRResult;
@ReactModule(name = ScannerModule.NAME)
public final class ScannerModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;    
    public static final String NAME = "Scanner";
    ActivityResultLauncher<QRResult> scanQrCode;
    public ScannerModule(ReactApplicationContext reactContext) {
      this.reactContext = reactContext;

      AppCompatActivity activity = (AppCompatActivity) reactContext.getCurrentActivity();
      scanQrCode = activity.registerForActivityResult(new ScanQRCode(),
          new ActivityResultCallback<QRResult>() {
              @Override
              public void onActivityResult(QRResult result) {
                        
              }
          }
      );

    } 

    @Override
    public String getName() {
     return NAME;
    }

    @ReactMethod
    public void scanQr(final Callback callback) {
      scanQrCode.launch(null);
    }
}
