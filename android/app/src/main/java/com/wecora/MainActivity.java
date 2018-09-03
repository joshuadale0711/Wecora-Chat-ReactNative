package com.wecora;

// import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.reactnativenavigation.controllers.SplashActivity;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
import com.facebook.react.modules.core.PermissionListener;

public class MainActivity extends SplashActivity implements OnImagePickerPermissionsCallback {
  private PermissionListener listener; // <- add this attribute

  // Your methods here

  // Copy from here

  @Override
  public void setPermissionListener(PermissionListener listener)
  {
    this.listener = listener;
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
  {
    if (listener != null)
    {
      listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }

  // To here
}