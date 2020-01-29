// Example of Constants which can be declared here.
// const someCommonValues = ['common', 'values'];
import qs from "qs";

let UAParser = require("ua-parser-js");

export const UAParserInstance = new UAParser();

/**
 * @description Randomize the order of elements in an array.
 * @param {Array} array
 * @author Quentin Drumez
 */
export const shuffleArray = array => {
  let arrayOut = [];
  while (array.length !== 0) {
    let randomIndex = Math.floor(Math.random() * array.length);
    arrayOut.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return arrayOut;
};

/**
 *
 * @param {*} props which contains commonStore & orgStore
 * @author Quentin Drumez
 */
export const getBaseUrl = props => {
  try {
    return (
      "/" +
      props.commonStore.locale +
      "/" +
      props.orgStore.currentOrganisation.tag
    );
  } catch (e) {
    return "/" + props.commonStore.locale;
  }
};

export const getUnique = (arr, comp) => {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

/**
 * @description Replace an object by new obj values and keys, but keep the initial object reference.
 * @param {*} obj
 * @param {*} newObj
 */
export const replaceAndKeepReference = (obj, newObj) => {
  // console.log(obj)
  // console.log(JSON.parse(JSON.stringify(obj)))
  // console.log(JSON.parse(JSON.stringify(newObj)))

  Object.keys(obj).forEach(function(key) {
    if (!newObj[key]) delete obj[key];
  });

  Object.keys(newObj).forEach(function(key) {
    obj[key] = newObj[key];
  });
};

/**
 * @description Get a clone of an object (remove references & mobx observable stuffs)
 * @param {*} obj
 * @author Quentin Drumez
 */
export const getClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

export const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone ||
  document.referrer.includes("android-app://");

export const getParsedUrlQuery = () => {
  let query = window.location.search;
  if (query.charAt(0) === "?") query = query.substr(1);
  let parsedQuery = qs.parse(query);
  return parsedQuery || {};
};

/**
 * @description Transform uploadcare link to fetch image in progressive mode
 * @param {String} url
 */
export const getProgressiveImage = url => {
  if (!url) return;
  if (url.search("https://ucarecdn.com") === -1) return url; // not an uploadcare link
  if (url.charAt(url.length - 1) !== "/") url += "/";
  url += "-/progressive/yes/";
  return url;
};
