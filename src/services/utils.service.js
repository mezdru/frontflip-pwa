// Example of Constants which can be declared here.
// const someCommonValues = ['common', 'values'];

/**
 * @description Randomize the order of elements in an array.
 * @param {Array} array 
 * @author Quentin Drumez
 */
export const shuffleArray = (array) => {
  let arrayOut = [];
  while(array.length !== 0) {
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