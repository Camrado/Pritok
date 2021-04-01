let isNameValid = false;
let isUpdatedNameValid = true;

function nameValidator(rule, value, callback) {
  if (!value) {
    isNameValid = false;
    isUpdatedNameValid = false;
    callback(new Error('Name field is required'));
  } else if (value.length < 2) {
    isNameValid = false;
    isUpdatedNameValid = false;
    callback(new Error('Minimum 2 characters'));
  } else {
    isNameValid = true;
    isUpdatedNameValid = true;
    callback();
  }
}

let isDescriptionValid = false;
let isUpdatedDescriptionValid = true;

function descriptionValidator(rule, value, callback) {
  if (!value) {
    isDescriptionValid = false;
    isUpdatedDescriptionValid = false;
    callback(new Error('Description field is required'));
  } else if (value.length < 2) {
    isDescriptionValid = false;
    isUpdatedDescriptionValid = false;
    callback(new Error('Minimum 2 characters'));
  } else {
    isDescriptionValid = true;
    isUpdatedDescriptionValid = true;
    callback();
  }
}

export { isNameValid, isUpdatedNameValid, nameValidator, isDescriptionValid, isUpdatedDescriptionValid, descriptionValidator };
