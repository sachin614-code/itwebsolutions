const UserModel = require("../../models/user.model");

/**
 * get the register form
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.index = (req, res, next) => {
  res.render("register", {
    title: "register",
    appName: "OK",
  });
};

/**
 *
 * Handle register post request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */
exports.register = async (req, res, next) => {
  try {
    // check user exist or not
    const userFound = await UserModel.findOne({ email: req.body.email });

    const user = await UserModel.create(req.body);

    return res.redirect("login");
  } catch (error) {
    next(error);
  }
};

/**
 * handle the logout request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.logout = (req, res, next) => {
  req.logout();
  req.flash("success", "Logout successfully.");
  res.redirect("/login");
};
