let isNameValid = false;
let isSettingsNameValid = true;

function nameValidator(rule, value, callback) {
  if (!value) {
    isNameValid = false;
    isSettingsNameValid = false;
    callback(new Error('Name field is required'));
  } else if (!/^[a-zA-Z ]{2,20}$/.test(value) && value) {
    isNameValid = false;
    isSettingsNameValid = false;
    callback(new Error('Only letters and spaces. Minimum 2, maximum 20 characters.'));
  } else {
    isNameValid = true;
    isSettingsNameValid = true;
    callback();
  }
}

let isEmailValid = false;

function emailValidator(rule, value, callback) {
  let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!value) {
    isEmailValid = false;
    callback(new Error('Email field is required'));
  } else if (!re.test(value) && value) {
    isEmailValid = false;
    callback(new Error('Email is not valid'));
  } else {
    isEmailValid = true;
    callback();
  }
}

let isPasswordValid = false;

function passwordValidator(rule, value, callback) {
  if (!value) {
    isPasswordValid = false;
    callback(new Error('Password field is required'));
  } else if (value.length < 6) {
    isPasswordValid = false;
    callback(new Error('Password must contain at least 6 characters'));
  } else if (value.search(/[a-z]/i) < 0) {
    isPasswordValid = false;
    callback(new Error('Password must contain at least one letter'));
  } else if (value.search(/[0-9]/) < 0) {
    isPasswordValid = false;
    callback(new Error('Password must contain at least one digit'));
  } else {
    isPasswordValid = true;
    callback();
  }
}

let isNewPasswordValid = false;

function newPasswordValidator(rule, value, callback) {
  if (!value) {
    isNewPasswordValid = false;
    callback(new Error('Password field is required'));
  } else if (value.length < 6) {
    isNewPasswordValid = false;
    callback(new Error('Password must contain at least 6 characters'));
  } else if (value.search(/[a-z]/i) < 0) {
    isNewPasswordValid = false;
    callback(new Error('Password must contain at least one letter'));
  } else if (value.search(/[0-9]/) < 0) {
    isNewPasswordValid = false;
    callback(new Error('Password must contain at least one digit'));
  } else {
    isNewPasswordValid = true;
    callback();
  }
}

let isConfirmNewPasswordValid = false;

function confirmNewPasswordValidator(rule, value, callback) {
  if (!value) {
    isConfirmNewPasswordValid = false;
    callback(new Error('Password field is required'));
  } else if (value.length < 6) {
    isConfirmNewPasswordValid = false;
    callback(new Error('Password must contain at least 6 characters'));
  } else if (value.search(/[a-z]/i) < 0) {
    isConfirmNewPasswordValid = false;
    callback(new Error('Password must contain at least one letter'));
  } else if (value.search(/[0-9]/) < 0) {
    isConfirmNewPasswordValid = false;
    callback(new Error('Password must contain at least one digit'));
  } else {
    isConfirmNewPasswordValid = true;
    callback();
  }
}

let isCodeValid = false;

function codeValidator(rule, value, callback) {
  if (!value) {
    isCodeValid = false;
    callback(new Error('Code field is required'));
  } else if (value.length !== 6) {
    isCodeValid = false;
    callback(new Error('Code length must be equal to 6'));
  } else {
    isCodeValid = true;
    callback();
  }
}

export {
  isNameValid,
  isSettingsNameValid,
  nameValidator,
  isEmailValid,
  emailValidator,
  isPasswordValid,
  passwordValidator,
  isNewPasswordValid,
  newPasswordValidator,
  isConfirmNewPasswordValid,
  confirmNewPasswordValidator,
  isCodeValid,
  codeValidator
};
