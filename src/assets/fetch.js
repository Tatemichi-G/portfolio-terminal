import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.VITE_CMS_DOMAIN,
  apiKey: import.meta.env.VITE_CMS_APIKEY,
});

export const getCMS = async () => {
  try {
    const cms = await client.get({
      endpoint: "news",
    });
    return cms;
  } catch (err) {
    console.error(err);
  }
};

// export const getCMS = async() => {
//   try {

//     const response = await fetch("/api/news.php");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// };
