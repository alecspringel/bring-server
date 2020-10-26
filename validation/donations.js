const Validator = require("validator");
const isEmpty = require("is-empty");

function validateNewDonation(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.first = isEmpty(data.first) ? "" : data.first;
  data.last = isEmpty(data.last) ? "" : data.last;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.phone = isEmpty(data.phone) ? "" : data.phone;
  data.itemName = isEmpty(data.itemName) ? "" : data.itemName;
  data.preferPhone = isEmpty(data.preferPhone) ? "" : data.preferPhone;
  data.preferEmail = isEmpty(data.preferEmail) ? "" : data.preferEmail;

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone field is required";
  }
  if (Validator.isEmpty(data.first)) {
    errors.first = "First name is required";
  }
  if (Validator.isEmpty(data.last)) {
    errors.last = "Last name is required";
  }
  if (Validator.isEmpty(data.itemName)) {
    errors.itemName = "Name of item is required";
  }
  if (Validator.isEmpty(data.preferPhone)  || !Validator.isBoolean(data.preferPhone)) {
    errors.preferPhone = "Preferred contact method is malformed";
  }
  if (Validator.isEmpty(data.preferEmail)  || !Validator.isBoolean(data.preferEmail)) {
    errors.preferEmail = "Preferred contact method is malformed";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateNewDonation };
