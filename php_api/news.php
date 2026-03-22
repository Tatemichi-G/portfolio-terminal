<?php

// config.php の場所を先にまとめておく。
$configPath = __DIR__ . "/config.php";

// 設定ファイルがない時は、理由が分かるようにJSONで止める。
if (!file_exists($configPath)) {
  // サーバー側の設定不足として 500 を返す。
  http_response_code(500);
  // JSONを返すので受け取り側で内容を確認しやすい。
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode([
    "message" => "config.php not found",
  ]);
  exit;
}

// 設定ファイルがある時だけ読み込む。
require_once $configPath;

// microCMS の news エンドポイントURLを作る。
$url = "https://" . $cmsDomain . ".microcms.io/api/v1/news";

// GETで取りに行き、APIキーはヘッダーに付ける。
$options = [
  "http" => [
    "method" => "GET",
    "header" => "X-MICROCMS-API-KEY: " . $cmsApiKey . "\r\n",
  ],
];

// 上の接続設定を file_get_contents で使える形にする。
$context = stream_context_create($options);
// 実際にmicroCMSからデータを取得する。
$result = file_get_contents($url, false, $context);

// React側でそのまま扱いやすいようにJSONで返す。
header("Content-Type: application/json; charset=utf-8");
echo $result;

// 元のシンプル版
// require_once __DIR__ . "/config.php";
