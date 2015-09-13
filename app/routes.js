var passport = require('passport');
module.exports = function (app) {

    //pages
    app.get('/', app.home);
    
    //auth
    app.post('/register', app.register);
    app.post('/login', app.login);
    app.get('/logout', app.logout);
    app.get('/auth/facebook', app.loginWithFacebook);
    app.get('/auth/facebook/callback', app.facebookCallback);
    app.get('/auth/google', app.loginWithGoogle);
    app.get('/auth/google/callback', app.googleCallback);


    //api calls
//    app.get('/api/v1/serviceURL', app.nameOfService);


};
