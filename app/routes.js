module.exports = function (app, passport) {

  // Front end routes
  app.get('/', function (req, res) {
    res.render('login');
  });

  app.get('/login', function (req, res) {
    res.render('login', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/app',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login')
  });

  app.get('/app', isLoggedIn, (req, res) => {
    res.render('app', {
      user: req.user
    })
  });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  return res.redirect('/')
}

}
