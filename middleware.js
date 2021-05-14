module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    //req.flash('error', 'you must log in');
    return res.redirect('/login');
  }

  next();
};
module.exports.isAdminL = async (req, res, next) => {
  if (!req.user.isAdmin) {
    await res.send('your not authorize to enter');
  }
  next();
};
module.exports.isBarangay = async (req, res, next) => {
  if (!req.user.isBarangay) {
    await res.send('your not authorize to enter');
  }
  next();
};
