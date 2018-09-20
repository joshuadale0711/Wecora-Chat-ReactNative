package com.wecora;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;

import com.alinz.parkerdan.shareextension.RealPathUtil;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

public class SharedActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(new View(this));


        Intent intento = this.getIntent();
        //String action = intento.getAction();
        String type = intento.getType();

        if (type != null) {
            prepareImages();
        }
    }


    public void prepareImages() {

        Intent intent = this.getIntent();
        String action = intent.getAction();
        String type = intent.getType();

        String value = "";

        if (Intent.ACTION_SEND.equals(action) && "text/plain".equals(type)) {
            value = intent.getStringExtra(Intent.EXTRA_TEXT);
        } else if (Intent.ACTION_SEND.equals(action) && ("image/*".equals(type) || "image/jpeg".equals(type) || "image/png".equals(type) || "image/jpg".equals(type))) {
            Uri uri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
            value = uritoValue(uri);

        } else if (Intent.ACTION_SEND_MULTIPLE.equals(action) && ("image/*".equals(type) || "image/jpeg".equals(type) || "image/png".equals(type) || "image/jpg".equals(type))) {
            ArrayList<Uri> uriList = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
            type = "MULTIPLE_IMAGES";
            int i = 0;
            for (Uri uri : uriList) {
                if (isGoogleNewPhotosUri(uri)) {
                    type = "GOOGLE_MULTIPLE_IMAGES";
                }
                value += uritoValue(uri) + "";
                i++;
                if (i == 5) break;
            }
        } else {
            value = "";
        }

        Log.e("impo", value + " GOt here e");
        Intent intento = new Intent(Intent.ACTION_VIEW, Uri.parse("app://wecoraShare/" + value));


        startActivity(intento);
        Intent newintent = new Intent(this, MainActivity.class);
        newintent.setAction(Intent.ACTION_MAIN);
        newintent.addCategory(Intent.CATEGORY_LAUNCHER);
        startActivity(newintent);
        finish();
    }


    private String uritoValue(Uri uri) {

        String value = "";
        try {
            if (isGoogleNewPhotosUri(uri)) {
                value = "file://" + googlePhotos(uri);
            } else if (uri.toString().startsWith("content://")) {

                value = "file://" + convertToBitmapAndCreateAFile(uri);

            } else {
                value = "file://" + RealPathUtil.getRealPathFromURI(this, uri);
            }
        } catch (IOException e) {
            value = "";
            e.printStackTrace();
        }
        return value;
    }

    private String convertToBitmapAndCreateAFile(Uri uri) throws IOException {

        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), uri);
        String name = uri.toString().replaceFirst(".*/(\\w+).*", "$1");
        //create a file to write bitmap data
        File f = new File(this.getCacheDir(), System.currentTimeMillis() + "@" + name + ".jpeg");
        f.createNewFile();
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 80, bos);
        byte[] bitmapdata = bos.toByteArray();

        FileOutputStream fos = new FileOutputStream(f);
        fos.write(bitmapdata);
        fos.flush();
        fos.close();

        return f.getAbsolutePath();
    }

    private String googlePhotos(Uri uri) throws IOException {


        ParcelFileDescriptor parcelFileDescriptor = this.getContentResolver().openFileDescriptor(uri, "r");
        FileDescriptor fileDescriptor = parcelFileDescriptor.getFileDescriptor();
        Bitmap bitmap = BitmapFactory.decodeFileDescriptor(fileDescriptor);
        parcelFileDescriptor.close();
        //Bitmap bitmap = MediaStore.Images.Media.getBitmap(reactApplicationContext.getContentResolver(), uri);
        String name = uri.toString().replaceFirst(".*/(\\w+).*", "$1");
        //create a file to write bitmap data
        File f = new File(this.getCacheDir(), System.currentTimeMillis() + "@" + name + ".jpeg");
        f.createNewFile();
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 80, bos);
        byte[] bitmapdata = bos.toByteArray();

        FileOutputStream fos = new FileOutputStream(f);
        fos.write(bitmapdata);
        fos.flush();
        fos.close();

        return f.getAbsolutePath();
    }

    public static boolean isGoogleOldPhotosUri(Uri uri) {
        return "com.google.android.apps.photos.content".equals(uri.getAuthority());
    }

    public static boolean isGoogleNewPhotosUri(Uri uri) {
        return "com.google.android.apps.photos.contentprovider".equals(uri.getAuthority());
    }
}
