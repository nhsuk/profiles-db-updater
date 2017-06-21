function addZeroPadding(number) {
  return number < 10 ? `0${number}` : number.toString();
}

function getMonth(date) {
  return addZeroPadding(date.getMonth() + 1);
}

function getDay(date) {
  return addZeroPadding(date.getDate());
}

function getDateYYYYMMDD(date) {
  return `${date.getFullYear()}${getMonth(date)}${getDay(date)}`;
}

module.exports = {
  getDateYYYYMMDD,
};
