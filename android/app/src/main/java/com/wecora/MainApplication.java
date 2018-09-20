package com.wecora;

import android.app.Application;
import android.support.annotation.Nullable;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.RNFirebasePackage;
import com.rnfs.RNFSPackage;
import fr.snapp.imagebase64.RNImgToBase64Package;
import com.imagepicker.ImagePickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import com.alinz.parkerdan.shareextension.SharePackage;

import com.imagepicker.ImagePickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;


import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import in.sriraman.sharedpreferences.RNSharedPreferencesReactPackage;

public class MainApplication extends NavigationApplication {

  @Override
  public boolean isDebug() {
      return BuildConfig.DEBUG;
  }

  @Nullable
  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFirebasePackage(),
            new RNFSPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNImgToBase64Package(),
            new ImagePickerPackage(),
            new FastImageViewPackage(),
            new VectorIconsPackage(),
            //new SharePackage(),
            new RNSharedPreferencesReactPackage()     
            );
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
  

}
