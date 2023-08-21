const UserModel = require("../../models/user.model");
const { hashValue, verifyHash } = require("../../helpers/hash.helper");
const { generateJwt } = require("../../helpers/jwt.helper");
const { loginValidation } = require("../../validationSchema/auth-schema");

/**
 * get the login form
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.index = (req, res, next) => {
  res.render("login", {title: "Login",lerr:""});
};

/**
 *
 * Handle login post request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */
exports.login = async (req, res, next) => {
  try {
    const result = await UserModel.findOne({
      email: req.body.email,
    });
    const { error } = await loginValidation(req.body);
    if (error) {
      return res.render("login", { err: "Invalid Credentials!" });
    }
    console.log(req.body.password);
    if (
      result === null ||
      !(req.body.password, result.password)
    ) {
      return res.render("login", { err: "Invalid Credentials!" });
    }
   /* if (
      result === null ||
      !(await verifyHash(req.body.password, result.password))
    ) {
      return res.render("login", { err: "Invalid Credentials!" });
    }*/
    req.session.userId = result._id;
    return res.redirect("/dashboard");
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
  req.session.destroy();
  res.redirect("/auth/login");
};
