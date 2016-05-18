// app.js

// --- filesystem
var fs = require("fs");

// --- logger
var log = require("./helpers/logger.js");

// --- express
var express = require("express");
var app = express();

// --- Cookie parser
var cookieParser = require('cookie-parser')
app.use(cookieParser());

// --- CSRF
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

// --- Handlebars
var exphbs  = require('express-handlebars');
app.engine(".hbs", exphbs({extname: ".hbs", defaultlayout: "main"}));
app.set('view engine', '.hbs');

// --- Socket IO
var http = require("http").Server(app);
var io = require("socket.io")(http);

// --- Redis
var redis = require("redis");
var client = redis.createClient();

// --- body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- Game
var MDBGame = require("./mdb/mdbgame.js");

// --- Setup static
app.use(express.static(__dirname + "/client"));


// --- Middleware ---
// error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err)
  }

  // handle CSRF token errors here
  res.status(403);
  res.json({error : 'form tampered with'});
})

// --- Routes

/**
 * The Home page
 */
app.get("/", csrfProtection, function(req, res){
    res.render("react", { csrf: req.csrfToken() });
});

// Join a game by ID or create a new game
app.post("/join", csrfProtection, function(req,res){
    var ip = req.connection.remoteAddress;
    var username = req.body.username;

    if (username === null) {
        log.warning(ip + " - " + "Did not send username.");
        res.status(500).json(
            {
                "type": "error",
                "field": "username",
                "message": "Please enter a username"
            }
        );
    }
    var roomID = req.body.room_id;
    if (roomID) {
        log.info(ip + " - " + username + " trying to connect to room '" + roomID + "'");
    }

    // Get the rooms out of redis and let the player join that.
    client.hlen("room:" + roomID, function(err, len){
        console.log(len);
    });

    var retData = {}

    retData.username = username;
    retData.roomID = "someroom";
    retData.token = "a jwt token";
    res.json(retData);
});

// --- Socket IO
io.on("connection", function(socket){

    // --- Check the token to make sure they are properly connected.
    var address = socket.handshake.address;
    log.info(address + ": Client Connected");
    MDBGame.initGame(io, socket);
});

io.on("disconnect", function(socket){
    var address = socket.handshake.address;
    log.info(address + ": Client Diconnected")
})

// --- Server Config
var host = process.env.HOST || process.env.IP || "127.0.0.1"
var port = process.env.PORT || 3000

http.listen(port, host, function(){
    populateCards();
    log.info("Example app listening on port " + host + ":" + port);
});

/**
 * Populate the cards if they need populating
 */
function populateCards() {
    var obj;

    client.get("status:hasCards", function(err, reply){
        if (reply === null) {
            log.info("No cards in Redis store. Populating cards.")
            fs.readFile("./cards.json", "utf8", function (err, data) {
                if (err) {
                    throw err;
                }
                obj = JSON.parse(data);

                // Populate cards
                var cardsPopulated = 0,
                    goldCards = obj.gold;

                goldCards.forEach(function (card) {
                    cardsPopulated += 1;
                    client.hset("gold:" + card.id, "text", card.text);
                });
                log.info("Gold cards populated - " + cardsPopulated);

                cardsPopulated = 0;
                var triggerCards = obj.trigger;
                triggerCards.forEach(function(card){
                    client.hset("trigger:" + card["id"], "text", card["text"]);
                    cardsPopulated++;
                });
                log.info("Trigger cards populated - " + cardsPopulated);
                log.info("Finished populating cards in Redis store");

                // Say we have cards
                client.set("status:hasCards", true);
            });
        } else {
            log.info("Cards already populated, moving on.");
        }
    });
}
