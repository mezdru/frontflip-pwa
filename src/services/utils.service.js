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
 * @param {*} props which contains commonStore & organisationStore
 */
export const getBaseUrl = (props) => {
  return '/' + props.commonStore.locale + '/' + props.organisationStore.values.organisation.tag;
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