import axios from "axios";

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export const searchImages = async (query) => {
  const response = await axios.get(`https://api.unsplash.com/search/photos`, {
    params: { query },
    headers: {
      Authorization: `Client-ID ${accessKey}`
    }
  });
  return response.data.results;
};
