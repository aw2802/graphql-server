import axios from 'axios';

/**
  * constant variables
  */
const WIKIHOW_API_BASE_URL = 'https://hargrimm-wikihow-v1.p.mashape.com/';
const WIKIHOW_URL = 'http://www.wikihow.com/';
const WIKIHOW_CONFIG = {
  'X-Mashape-Key': 'ZF4AQocD2Cmsh9IU2WEtKtDHIYrjp16SwqzjsnqF9PbncTEYs7',
  'Accept': 'application/json'
};

/**
  * private function to parse url string and retrieve article title
  */
function getImageTitle(urlString) {
  //11 is the spaces after thumb to start
  const start = urlString.indexOf('thumb/') + 11;
  const end = urlString.indexOf('-Step-');

  return urlString.substr(start, (end - start));
}

/**
  * public function that fetches url and then transforms the data into
  * a readable object
  */
export function fetchImagesByURL(relativeURL, count) {
  return axios.get(
    `${WIKIHOW_API_BASE_URL}${relativeURL}?count=${count}`,
    { headers: WIKIHOW_CONFIG }
  ).then(res => {
    const data = res.data;
    let images = [];

    // create an exception for images that don't follow the convention
    Object.keys(data).map((key) => {
      const imageURL = data[key];
      const tempTitle = getImageTitle(imageURL);
      const wikiURL = WIKIHOW_URL + tempTitle;

      const title = `How to ${decodeURI((tempTitle).replace(/-/g, " "))}`;

      images.push({ imageURL, wikiURL, title });
    });

    // return a single object or an list of objects
    return count === 1 ? images[0] : images;
  });
}
