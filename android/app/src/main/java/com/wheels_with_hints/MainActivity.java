package com.wheels_with_hints;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView browser = findViewById(R.id.webBrowser);
        browser.setWebViewClient(new WebViewClient());
        WebSettings settings = browser.getSettings();
        settings.setJavaScriptEnabled(true);

        browser.loadUrl("http://94.50.162.171/");
    }
}
