<?php

require_once __DIR__ . "/config.php";

$url = "https://" . $cmsDomain . ".microcms.io/api/v1/news";

$options = [
  "http" => [
    "method" => "GET",
    "header" => "X-MICROCMS-API-KEY: " . $cmsApiKey . "\r\n",
  ],
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

header("Content-Type: application/json; charset=utf-8");
echo $result;
