const validator = require("validator");
const isEmpty = require("is-empty");

function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // email checks
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  // Password checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validateInvite(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.isAdmin = !isEmpty(data.isAdmin) ? data.isAdmin : "";

  // email
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email";
  }
  // isAdmin
  if (typeof data.isAdmin !== "boolean") {
    errors.isAdmin = "Must specify if user is admin or not";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validateFinish(data) {
  let errors = {};

  data.first = !isEmpty(data.first) ? data.first : "";
  data.last = !isEmpty(data.last) ? data.last : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirm = !isEmpty(data.confirm) ? data.confirm : "";

  // first
  if (validator.isEmpty(data.first)) {
    errors.first = "First name is required";
  }
  // last
  if (validator.isEmpty(data.last)) {
    errors.last = "Last name is required";
  }
  // password
  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (!/^(?=.*\d).{6,20}$/.test(data.password)) {
    errors.password =
      "Password must be between 6-20 characters and include a number";
  }
  // confirm
  if (data.password !== data.confirm) {
    errors.confirm = "Passwords do not match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validatePassword(password) {
  let errors = {};
  password = !isEmpty(password) ? password : "";
  if (!/^(?=.*\d).{6,20}$/.test(password)) {
    errors.error =
      "Password must be between 6-20 characters and include a number";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  validateInvite,
  validateLoginInput,
  validateFinish,
  validatePassword,
};
