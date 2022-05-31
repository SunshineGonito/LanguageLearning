const PORT = 2022;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const { Pool, Client } = require('pg');
const format = require('pg-format');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { prependOnceListener } = require('process');

const connectionString = process.env.connection_string

const pool = new Pool({ connectionString });

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './fileUpload')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: fileStorageEngine });
const sessionOptions = { secret: 'sessionsecret', resave: false, saveUninitialized: false };

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('cookiesecret'));
app.use(session(sessionOptions));
app.use(flash());

app.post('/single', upload.single('fileUpload'), (req, res) => {
    console.log(req.file);
    res.redirect('/home')
});

app.post('/sentence', (req, res, next) => {
    console.log(req.body)
    res.redirect('/home')
    next()
})

const userName = 'Sunshine'
const password = 'Sunshine123!'

app.post('/', (req, res, next) => {
    const userun = req.body.userName
    const userpw = req.body.password
    if (userun === userName && userpw === password) {
        return res.redirect('/home')
    }
    console.log('Username and password combination incorrect!')
    req.flash('danger', 'UN/PW combination incorrect!')
    res.redirect('/login')
    next()
});

app.set('view engine', 'ejs')
// this is how you set ejs as the templating tool
app.set('views', path.join(__dirname, '/views'))
// This is to make the ejs template on the views directory available even from a different directory

app.get('/login', (req, res) => {
    res.render('login.ejs', { messages: req.flash('danger') })
});
app.get('/home', (req, res) => {
    res.cookie('name', 'home123!', { signed: true });
    console.log(req.cookies);
    res.render('home.ejs')
});
// we use these lines of code to render the template in HTML format


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})
// This starts the server.

// async function test() {
//     let sql = format(`select * from defaultdb.default.all_transactions`)
//     let test_data = await pool.query(sql)
//     console.log(test_data.rows)
// }

// test()

