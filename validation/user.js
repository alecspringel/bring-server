const validator = require("validator");
const isEmpty = require("is-empty");

function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // email checks
  if (validator.isEmpty(data.email)) {
    errors.email = "email field is required";
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
  if (validator.isEmpty(data.isAdmin)) {
    errors.isAdmin = "Must specify if user is admin or not";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateInvite, validateLoginInput };
