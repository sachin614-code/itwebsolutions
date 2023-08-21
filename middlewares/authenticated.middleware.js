const authenticated = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/auth/login");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticated,
};
