let isNameValid = false;
let isUpdatedNameValid = true;

function nameValidator(rule, value, callback) {
  if (!value) {
    isNameValid = false;
    isUpdatedNameValid = false;
    callback(new Error('Name field is required'));
  } else if (!/^[a-zA-Z\s]*$/.test(value) && value) {
    isNameValid = false;
    isUpdatedNameValid = false;
    callback(new Error('Only letters/spaces'));
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
  } else if (!/^[a-zA-Z0-9,.!? ]*$/.test(value) && value) {
    isDescriptionValid = false;
    isUpdatedDescriptionValid = false;
    callback(new Error('Only letters/spaces/numbers/full stops/commas'));
  } else {
    isDescriptionValid = true;
    isUpdatedDescriptionValid = true;
    callback();
  }
}

export { isNameValid, isUpdatedNameValid, nameValidator, isDescriptionValid, isUpdatedDescriptionValid, descriptionValidator };
