// auth.js
import passport from 'passport';
import WindowsStrategy from 'passport-windowsauth';

const allowedUsers = ['', ''];

passport.use('windowsauth', new WindowsStrategy({
    ldap: {
        url: '',
        base: '',
        bindDN: '',
        bindCredentials: ''
    },
    passReqToCallback: true,
}, function (req, profile, done) {
    console.log(req);
    console.log(profile);
    if (!allowedUsers.includes(profile.id)) {
        return done(new Error('Not allowed'), null);
    }
    return done(null, profile);
}));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

function ensureAuthenticated(req, res, next) {
    console.log('Checking authentication');
    console.log('Is authenticated:', req.isAuthenticated());
    
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


export { passport, ensureAuthenticated };
