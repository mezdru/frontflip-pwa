// Example of Constants which can be declared here.
// const someCommonValues = ['common', 'values'];

/**
 * @description Randomize the order of elements in an array.
 * @param {Array} array 
 * @author Quentin Drumez
 */
export const shuffleArray = (array) => {
  let arrayOut = [];
  while (array.length !== 0) {
    let randomIndex = Math.floor(Math.random() * array.length);
    arrayOut.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return arrayOut;
}

/**
 * 
 * @param {*} props which contains commonStore & orgStore
 */
export const getBaseUrl = (props) => {
  try{
    return '/' + props.commonStore.locale + '/' + props.orgStore.currentOrganisation.tag;
  } catch(e) {
    return '/' + props.commonStore.locale;
  }
}

export const getUnique = (arr, comp) => {

  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

  return unique;
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * @description Replace an object by new obj values and keys, but keep the initial object reference.
 * @param {*} obj 
 * @param {*} newObj 
 */
export const replaceAndKeepReference = (obj, newObj) => {
  
  Object.keys(obj).forEach(function(key) {
    if(!newObj[key]) delete obj[key];
  });

  Object.keys(newObj).forEach(function(key) {
    obj[key] = newObj[key];
  });

}