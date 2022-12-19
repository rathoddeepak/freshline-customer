package com.clufter;

import android.os.Build;
import android.app.Activity;
import android.content.Intent;
import android.provider.Settings;
import android.content.pm.ResolveInfo;
import android.content.pm.PackageManager;
import android.provider.Telephony;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.List;
import java.util.ArrayList;
@ReactModule(name = ShareModule.NAME)
public final class ShareModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;    
    private List<ResolveInfo> activities;
    private Intent intent;
    public static final String NAME = "Share";

    public ShareModule(ReactApplicationContext reactContext) {
     this.reactContext = reactContext;     
    }

    @Override
    public String getName() {
     return NAME;
    }

    @ReactMethod
    public void GetAppList (String text, Promise promise) {
      intent = new Intent(Intent.ACTION_SEND, null);
      intent.setType("text/plain");    
      intent.putExtra(Intent.EXTRA_TEXT, text);
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activities = reactContext.getPackageManager().queryIntentActivities(intent, 0);
      WritableArray appNames = Arguments.createArray();      
      int count = 0;
      for (ResolveInfo info : activities) {
              WritableMap app = Arguments.createMap();
              String icon = ImageUtil.toBase64(info.loadIcon(reactContext.getPackageManager()));              
              app.putString("name", info.loadLabel(reactContext.getPackageManager()).toString());
              app.putString("package", info.activityInfo.packageName);
              app.putString("icon", icon);
              app.putInt("index", count);              
              appNames.pushMap(app);
              count++;
      }     
      promise.resolve(appNames);
    }

    @ReactMethod
    public void GetFeaturedList (Promise promise) {
      ArrayList<App> apps = new ArrayList<>();
      apps.add(new App(0, "WhatsApp", "com.whatsapp", "wp"));
      apps.add(new App(0, "WhatsApp Bussiness", "com.whatsapp.w4b", "wpb"));
      apps.add(new App(0, "Facebook", "com.facebook.katana", "fb"));
      apps.add(new App(0, "Telegram", "org.telegram.messenger", "tg"));
      apps.add(new App(0, "Telegram X", "org.thunderdog.challegram", "tgx"));
      if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        String defaultSmsApp = Telephony.Sms.getDefaultSmsPackage(reactContext);
        apps.add(new App(0, "Messages", defaultSmsApp, "ph"));
      } 
      apps.add(new App(0, "Gmail", "com.google.android.gm", "ml"));
      apps.add(new App(0, "Facebook", "com.facebook.katana", "fb"));      
      //apps.add(new App(0, "Facebook Lite", "com.facebook.lite", "fbl"));
      apps.add(new App(0, "Instagram", "com.instagram.android", "ig"));
      //apps.add(new App(0, "Instagram Lite", "com.instagram.lite", "igl"));
      apps.add(new App(0, "Messenger Lite", "com.facebook.mlite", "mg"));
      apps.add(new App(0, "Messenger", "com.facebook.orca", "mgl"));
      apps.add(new App(0, "Twitter", "com.twitter.android", "tw"));
      apps.add(new App(0, "Twitter Lite", "com.twitter.android.lite", "twl"));
      apps.add(new App(0, "Slack", "com.Slack", "sl"));
      apps.add(new App(0, "Discord", "com.discord", "dc"));
      apps.add(new App(0, "Line", "jp.naver.line.android", "ln"));
      apps.add(new App(0, "Line", "com.linecorp.linelite", "lnl"));    
      apps.add(new App(0, "Skype", "com.skype.raider", "sp"));
      apps.add(new App(0, "Skype Lite", "com.skype.m2", "spl"));
      WritableArray appNames = Arguments.createArray();
      PackageManager pm = reactContext.getPackageManager();     
      for (int i = 0; i < 13; i++) {
        if(isPackageInstalled(apps.get(i).pkg, pm)){
          WritableMap app = Arguments.createMap();
          app.putString("name", apps.get(i).name);
          app.putString("package", apps.get(i).pkg);
          app.putString("icon", apps.get(i).icon);
          app.putInt("index", apps.get(i).index);
          appNames.pushMap(app);
        }
      }
      promise.resolve(appNames);
    }
    
    @ReactMethod
    public void ShareTo(int index){
      if(activities != null && intent != null){
        ResolveInfo info = activities.get(index);
        intent.setPackage(info.activityInfo.packageName);
        reactContext.startActivity(intent);
      }      
    }

    @ReactMethod
    public void ShareApp(String packageName, String text){
      final Intent intent = new Intent(Intent.ACTION_SEND, null);
      intent.setType("text/plain");
      intent.putExtra(Intent.EXTRA_TEXT, text);
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      intent.setPackage(packageName);
      reactContext.startActivity(intent);
    }

    @ReactMethod
    public void sendSMS(String text){
      intent = new Intent(Intent.ACTION_SEND, null);
      intent.setType("text/plain");
      intent.putExtra(Intent.EXTRA_TEXT, text);
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
          String defaultSmsApp = Telephony.Sms.getDefaultSmsPackage(reactContext);
          PackageManager pm = reactContext.getPackageManager();
          Intent intent = pm.getLaunchIntentForPackage(defaultSmsApp);
            if (intent != null) {
              reactContext.startActivity(intent);
            }
      } else {
          Intent intent = new Intent(Intent.ACTION_MAIN);
          intent.addCategory(Intent.CATEGORY_DEFAULT);
          intent.setType("vnd.android-dir/mms-sms");
          reactContext.startActivity(intent);
      }
    }

    private boolean isPackageInstalled(String packageName, PackageManager packageManager) {
        try {
            packageManager.getPackageInfo(packageName, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    @ReactMethod
    public void clear() {
      activities = null;
      intent = null;
    }    
}


