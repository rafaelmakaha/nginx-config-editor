const db = require('./database');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    // serializer
    passport.serializeUser(function (user, done){
        done(null, user);
    });

    // deserializer
    passport.deserializeUser(function (user, done) {
        done(null,user);
    })

    // login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        if (username != db.username){
            return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
        }
        if (password != db.password){
            return done(null, false, req.flash('loginMessage', 'Senha incorreta.'));
        }
        return done(null, username);
    }))
}