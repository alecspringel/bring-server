const Validator = require("validator");
const isEmpty = require("is-empty");

function validateNewDonation(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.first = isEmpty(data.first) ? "" : data.first;
  data.last = isEmpty(data.last) ? "" : data.last;
  data.email = isEmpty(data.email) ? "" : data.email;

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.first)) {
    errors.first = "First name is required";
  }
  if (Validator.isEmpty(data.last)) {
    errors.last = "Last name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validateModifyDonation(data) {
  //WIP
  let errors = {};
  const modified = data.modified;
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.first)) {
    errors.first = "First name is required";
  }
  if (Validator.isEmpty(data.last)) {
    errors.last = "Last name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateNewDonation };
