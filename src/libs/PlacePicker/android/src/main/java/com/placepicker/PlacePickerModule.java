package com.placepicker;

import androidx.annotation.Nullable;
import android.location.Address;
import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ActivityEventListener;

import com.app.akplacepicker.models.AddressData;
import com.app.akplacepicker.utilities.Constants;
import com.app.akplacepicker.utilities.PlacePicker;
import java.util.List;
import com.placepicker.R;
@ReactModule(name = PlacePickerModule.NAME)
public final class PlacePickerModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private ReactApplicationContext reactContext;
    private Callback mCallback;
    public static final String NAME = "PlacePicker";
    public static final String LANG = "lng";
    public static final String LAT = "lat";
    public static final String PLACE_NAME = "place";
    public static final String ERROR = "error";
    public PlacePickerModule(ReactApplicationContext reactContext) {
     this.reactContext = reactContext;
     reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
     return NAME;
    }

    @ReactMethod
    public void openPicker(ReadableMap params, Callback callback) {
        Activity activity = reactContext.getCurrentActivity();        
        if(activity == null){
          WritableMap map = Arguments.createMap();
          map.putBoolean(ERROR, true);
          callback.invoke(map);
          return;
        }else{
          mCallback = callback;
        }
        String API = reactContext.getString(R.string.api_key);
        Intent intent = new PlacePicker.IntentBuilder()
                .setGoogleMapApiKey(API)
                .setLatLong(params.getDouble("lat"), params.getDouble("lng"))
                .setMapZoom(19.0f)
                .setAddressRequired(true)
                .setFabColor(R.color.colorPrimary)
                .setPrimaryTextColor(R.color.black)
                .build(activity);
        activity.startActivityForResult(intent, Constants.PLACE_PICKER_REQUEST);
    }

    //@Override
    public void onActivityResult(final Activity activity, final int requestCode, final int resultCode, final Intent data) {        
        if (requestCode == Constants.PLACE_PICKER_REQUEST && mCallback != null && data != null) {            
            AddressData addressData =  data.getParcelableExtra(Constants.ADDRESS_INTENT);
            WritableMap addressMap = Arguments.createMap();
            List<Address> addresses = addressData.getAddressList();
            String fn = "";
            if(addresses != null)fn = addresses.get(0).getAddressLine(0);                            
            else fn = addressData.getPlaceName();
            addressMap.putBoolean(ERROR, false);
            addressMap.putString(LANG, String.valueOf(addressData.getLongitude()));
            addressMap.putString(LAT, String.valueOf(addressData.getLatitude()));
            addressMap.putString(PLACE_NAME, fn);                
            mCallback.invoke(addressMap);            
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
      this.onActivityResult(null, requestCode, resultCode, data);
    }

     /**
       * Called when a new intent is passed to the activity
       */
       @Override
       public void onNewIntent(Intent intent){
         // ToDo
       }
}
