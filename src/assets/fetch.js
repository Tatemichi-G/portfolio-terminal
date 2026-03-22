import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.VITE_CMS_DOMAIN,
  apiKey: import.meta.env.VITE_CMS_APIKEY,
});

export const getCMS = async () => {
  try {
    // 本番ではXserver上のPHP APIを読む。
    if (import.meta.env.PROD) {
      // PHP側でmicroCMSに接続して、その結果だけ受け取る。
      const response = await fetch("/api/news.php");
      // 返ってきたJSONをそのまま使える形にする。
      const data = await response.json();
      return data;
    }

    // 開発中は .env を使って microCMS を直接読む。
    const cms = await client.get({
      endpoint: "news",
    });
    return cms;
  } catch (err) {
    console.error(err);
  }
};

// ローカル検証用で、microCMSを常に直接読む時の元コード
// export const getCMS = async () => {
//   try {
//     const cms = await client.get({
//       endpoint: "news",
//     });
//     return cms;
//   } catch (err) {
//     console.error(err);
//   }
// };

// 本番でPHP APIだけに固定したい時の元コード
// export const getCMS = async () => {
//   try {
//     const response = await fetch("/api/news.php");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// };
