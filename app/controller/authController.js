var passport = require('passport');
var config = require('../../config/config');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {
    var User = app.models.User;

    // Register===================================================================
    app.register =
        function (req, res, next) {
            passport.authenticate('local-signup', function (err, user, info) {
                if (err) {
                    return res.send(401);
                }
                if (!user) {
                    return res.send(401, {
                        "error": info
                    });
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return res.send(401, {
                            "error": info
                        });
                    }
                    res.cookie('user', JSON.stringify({
                        'id': user.id
                    }), {
                        httpOnly: false
                    });
                    res.send(200, {
                        "success": "success",
                        user: req.user
                    });
                });
            })(req, res, next);

        }



    // AUTHENTICATE (FIRST LOGIN) ==================================================
    app.login = function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return res.send(401);
            }
            if (!user) {
                return res.send(401, {
                    "error": info
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.send(401, {
                        "error": info
                    });
                }
                res.cookie('user', JSON.stringify({
                    'id': user.id
                }), {
                    httpOnly: false
                });
                res.send(200, {
                    "success": "success",
                    user: req.user
                });
            });
        })(req, res, next);
    }


    // LOGOUT =======================================================================
    app.logout = function (req, res) {
        req.logout();
        res.clearCookie("user");
        res.redirect('/');
    }

    // Facebook Login ===============================================================


    app.loginWithFacebook = passport.authenticate('facebook', {
        scope: ['email']
    });

    app.facebookCallback = function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(401);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.cookie('user', JSON.stringify({
                    'id': user.id
                }), {
                    httpOnly: false
                });
                res.redirect('/');
            });
        })(req, res, next);

    }

    // Google Login ===============================================================
    app.loginWithGoogle = passport.authenticate('google', {
        scope: ['profile', 'email']
    });

    app.googleCallback = function (req, res, next) {
        passport.authenticate('google', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(401);
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.cookie('user', JSON.stringify({
                    'id': user.id
                }), {
                    httpOnly: false
                });
                res.redirect('/');
            });
        })(req, res, next);

    }

};
