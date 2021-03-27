let isItemValid = false;
let isUpdatedItemValid = true;

function itemValidator(rule, value, callback) {
  if (!value) {
    isItemValid = false;
    isUpdatedItemValid = false;
    callback(new Error('Product field is required'));
  } else if (!/^[a-zA-Z\s]*$/.test(value) && value) {
    isItemValid = false;
    isUpdatedItemValid = false;
    callback(new Error('Only letters/spaces'));
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
