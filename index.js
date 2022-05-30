const PORT = 2022;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const { Pool, Client } = require('pg')
const format = require('pg-format')

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

const verifyLogin = (req, res, next) => {
    const userun = req.body.userName
    const userpw = req.body.password
    if (userun === userName && userpw === password) {
        return res.redirect('/home')
    }
    console.log('Username and password combination incorrect!')
    res.redirect('/login')
    next()
};

app.set('view engine', 'ejs')
// this is how you set ejs as the templating tool
app.set('views', path.join(__dirname, '/views'))
// This is to make the ejs template on the views directory available even from a different directory

app.get('/home', verifyLogin, (req, res) => {
    res.render('home.ejs')
});
// we use these lines of code to render the template in HTML format

app.get('/login', (req, res) => {
    res.render('login.ejs')
});

// app.post('/', (req, res, next) => {
//     const userun = req.body.userName
//     const userpw = req.body.password
//     if (userun === userName && userpw === password) {
//         return res.redirect('/home')
//     }
//     console.log('Username and password combination incorrect!')
//     res.redirect('/login')
//     next()
// });

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})
// This starts the server.

