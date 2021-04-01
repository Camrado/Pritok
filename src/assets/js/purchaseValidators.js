let isItemValid = false;
let isUpdatedItemValid = true;

function itemValidator(rule, value, callback) {
  if (!value) {
    isItemValid = false;
    isUpdatedItemValid = false;
    callback(new Error('Product field is required'));
  } else if (value.length < 2) {
    isItemValid = false;
    isUpdatedItemValid = false;
    callback(new Error('Minimum 2 characters'));
  } else {
    isItemValid = true;
    isUpdatedItemValid = true;
    callback();
  }
}

let isDateValid = true;

function dateValidator(rule, value, callback) {
  if (!value) {
    isDateValid = false;
    callback(new Error('Date field is required'));
  } else {
    isDateValid = true;
    callback();
  }
}

export { isItemValid, isUpdatedItemValid, itemValidator, isDateValid, dateValidator };
