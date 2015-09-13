module.exports = {
    SESSION_SECRET: process.env.TOKEN_SECRET || 'secret',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/collection',
    facebook: {
        clientID: 'clientID',
        clientSecret: 'clientSecret',
        callbackURL: 'http://localhost/auth/facebook/callback'
    },
    google: {
        clientID: 'clientID',
        clientSecret: 'clientSecret',
        callbackURL: 'http://localhost/auth/google/callback'
    }
};
