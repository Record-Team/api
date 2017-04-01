var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http');
var apiSql = require('./apiSql.js');

var port = process.env.PORT || 8080;
var router = express.Router();

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');//GET,PUT,POST,DELETE
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(function (req, res, next) {
    console.log(`${req.method}: ${req.url}`)
    next();
});

app.use(allowCrossDomain);

var appRouter = express.Router();
var apiRouter = express.Router();
var authRouter = express.Router();

apiSql(apiRouter);

appRouter.get('/test', function (req, res) {
    res.sendFile(__dirname + '/Test.html');
});

appRouter.post('/auth/login', function (req, res) {
    console.log(res.cookies)

    res.json({ ResultOk: true });
});

app.use('/', appRouter);
app.use('/api', apiRouter);
app.get('*', function (req, res) {
    res.json({
        ResultOk: false,
        ResultMessage: 'Sorry this url does not exist'
    });
});


app.listen(port);

console.log('...running at https://localhost:' + port);