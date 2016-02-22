var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var app = express();
var session = require("express-session");

function Server() {
    var self = this;
    self.connectMysql();
};



Server.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: '',
        database: '608db',
        debug: false
    });
    pool.getConnection(function(err, connection) {
        if (err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
}

Server.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(function(req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    var api_router = express.Router();

    app.use('/api', api_router);
    

    var rest_router = new rest.REST_ROUTER(api_router, connection, md5);
    self.startServer();
}

Server.prototype.startServer = function() {
    app.listen(3000, function() {


        app.use(express.static('public'));


        console.log("All right ! I am alive at Port 3000.");
    });
}

Server.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new Server();

app.use(session({
        secret: "Proyecto608020498",
        resave: false,
        saveUninitialized: false

    }));

app.get("/", function(req, res) {

    console.log("ENTRA A /");
    res.sendFile(__dirname + '/public/login.html');

});
app.get("/dashboard", function(req, res) {

    console.log("ENTRA A /dashboard");
    if(req.session.userid !== undefined){
    res.send(String(req.session.userid));
    //res.sendFile(__dirname + '/public/index.html');
    }else{
        req.session.userid = 1;
        res.send(req.session.userid);
    }

});