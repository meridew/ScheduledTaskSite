// server.js
import express from 'express';
import { PowerShell } from 'node-powershell';
import session from 'express-session';
import { passport, ensureAuthenticated } from './middleware/auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import flash from 'connect-flash';
import ejs from 'ejs';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(flash());

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

app.post('/login', (req, res, next) => {
    passport.authenticate('windowsauth', { failureRedirect: '/login', failureFlash: 'Invalid username or password.' }, (err, user, info) => {
        console.log('Authentication callback');
        console.log('Error:', err);
        console.log('User:', user);
        console.log('Info:', info);

        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

app.use(express.static('public'));

app.get('/getTasks', ensureAuthenticated, async (req, res) => {
    const result = await PowerShell.$`./getTasks.ps1`;
    const task = JSON.parse(result.raw);
    res.send(task);
});

app.get('/runTask/:id', ensureAuthenticated, async (req, res) => {
    const taskId = req.params.id;
    const output = await PowerShell.$`./runTask.ps1 ${taskId}`;
    res.send({ message: output });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
