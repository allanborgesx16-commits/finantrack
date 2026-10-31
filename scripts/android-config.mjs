import fs from 'node:fs';
const root = 'android/app/src/main/';
let gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
gradle = gradle.replace(/versionCode\s+\d+/, 'versionCode 2').replace(/versionName\s+"[^"]+"/, 'versionName "2.0.0"');
fs.writeFileSync('android/app/build.gradle', gradle);
let manifest = fs.readFileSync(root+'AndroidManifest.xml','utf8');
manifest = manifest.replace('android:allowBackup="true"','android:allowBackup="false"').replace(/android:icon="[^"]+"/,'android:icon="@drawable/finantrack_icon"').replace(/android:roundIcon="[^"]+"/,'android:roundIcon="@drawable/finantrack_icon"');
fs.writeFileSync(root+'AndroidManifest.xml',manifest);
fs.writeFileSync(root+'res/drawable/finantrack_icon.xml',`<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">
<path android:fillColor="#173d36" android:pathData="M0,0h108v108h-108z" />
<path android:fillColor="#c8dfa3" android:pathData="M32,26h44q6,0 6,6v44q0,6 -6,6h-44q-6,0 -6,-6v-44q0,-6 6,-6z" />
<path android:fillColor="#00000000" android:strokeColor="#246453" android:strokeWidth="4" android:strokeLineCap="round" android:strokeLineJoin="round" android:pathData="M38,65L49,53L58,60L72,43M61,43L72,43L72,54" />
</vector>`);
fs.writeFileSync(root+'res/values/styles.xml',`<?xml version="1.0" encoding="utf-8"?><resources>
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar"><item name="colorPrimary">#173d36</item><item name="colorPrimaryDark">#173d36</item><item name="colorAccent">#246453</item></style>
<style name="AppTheme.NoActionBar" parent="Theme.AppCompat.Light.NoActionBar"><item name="windowActionBar">false</item><item name="windowNoTitle">true</item><item name="android:background">@null</item></style>
<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen"><item name="windowSplashScreenBackground">#173d36</item><item name="windowSplashScreenAnimatedIcon">@drawable/finantrack_icon</item><item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item></style>
</resources>`);
fs.writeFileSync(root+'java/com/finantrack/app/MainActivity.java',`package com.finantrack.app;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    EdgeToEdge.enable(this);
  }
}
`);
console.log('FinanTrack Android 2.0.0 configured.');
