global.capitalizeFirstLetter = function CapitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

global.numberFormate = function NumberFormate(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

global.myPostHeader = function createPostHeader(token) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token,
  };
};
