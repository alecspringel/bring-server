const User = require("../mongo/models/User");

// MUST BE USED AFTER authUser MIDDLEWARE (depends on req.user)
const authAdmin = async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  console.log(user);
  if (user.isAdmin) {
    console.log(user.first, " is an authorized admin");
    next();
  } else {
    res.sendStatus(401);
  }
};

exports.authAdmin = authAdmin;
