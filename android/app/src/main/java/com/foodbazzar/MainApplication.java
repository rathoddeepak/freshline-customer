package com.foodbazzar;

import android.app.Application;
import android.content.Context;
import androidx.multidex.MultiDex;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactApplication;
import com.wenkesj.voice.VoicePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.PackageList;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import org.reactnative.maskedview.RNCMaskedViewPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.reactnativecommunity.art.ARTPackage;
import com.mrousavy.blurhash.BlurhashPackage;
import com.placepicker.PlacePickerPackage;
import ui.selectionmenu.RNSelectionMenuPackage;
import com.clufterupdate.InAppUpdatePackage;
import com.horcrux.svg.SvgPackage;
import com.clufter.SharePackage;
import com.oblador.shimmer.RNShimmerPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.microsoft.codepush.react.CodePush;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          packages.add(new MerryPhotoViewPackage());
          packages.add(new PlacePickerPackage());
          packages.add(new SharePackage());
          packages.add(new RNSelectionMenuPackage());
          packages.add(new InAppUpdatePackage());
          packages.add(new RNShimmerPackage());          
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        // bundle location from on each app start
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        protected JSIModulePackage getJSIModulePackage() {
          return new ReanimatedJSIModulePackage();
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
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    Fresco.initialize(this);    
  }

  //to run multi dex
  @Override
  protected void attachBaseContext(Context base) {
      super.attachBaseContext(base);
      MultiDex.install(this);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.foodbazzar.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
           
}
