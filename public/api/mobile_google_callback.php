<?php
// =============================================================================
// mobile_google_callback.php - Android APK (Capacitor) 用 Google OAuth 2.0 中継ブリッジ
// システムブラウザ（Chrome Custom Tabs）でのGoogle二段階認証・パスキー認証完了後、
// URLフラグメント (#id_token=...) を受け取り、カスタムURLスキームでアプリへ安全に戻します。
// =============================================================================
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ポンコツロボット工房 - ログイン認証完了</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #1c1917;
      color: #f5f5f4;
      font-family: sans-serif;
      text-align: center;
      box-sizing: border-box;
    }
    .card {
      background-color: #292524;
      border: 2px solid #d97706;
      border-radius: 16px;
      padding: 28px 24px;
      max-width: 360px;
      width: 100%;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    }
    h1 {
      color: #fbbf24;
      font-size: 18px;
      margin: 0 0 12px;
    }
    p {
      color: #d6d3d1;
      font-size: 13px;
      line-height: 1.6;
      margin: 0 0 20px;
    }
    .btn {
      display: inline-block;
      background-color: #d97706;
      color: #ffffff;
      font-weight: bold;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 9999px;
      font-size: 14px;
      border: 1px solid #fbbf24;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Google認証が完了しました</h1>
    <p id="msg">アプリ「ポンコツロボット工房」へ戻っています...</p>
    <a id="returnBtn" class="btn" href="com.takaharabooks.robotfactory://oauth-callback">アプリに戻る</a>
  </div>
  <script>
    (function() {
      var hash = window.location.hash || '';
      var search = window.location.search || '';
      var query = '';
      if (hash.indexOf('#') === 0 && hash.length > 1) {
        query = '?' + hash.substring(1);
      } else if (search.length > 1) {
        query = search;
      }
      var targetSchemeUrl = 'com.takaharabooks.robotfactory://oauth-callback' + query;
      var btn = document.getElementById('returnBtn');
      if (btn) {
        btn.setAttribute('href', targetSchemeUrl);
      }
      // 即座にカスタムスキームでAndroidアプリへリダイレクト
      window.location.replace(targetSchemeUrl);
    })();
  </script>
</body>
</html>
