// app.js
// --- express
var fs = require("fs");
var log = require("./logger.js");


var express = require("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

var redis = require("redis"),
    client = redis.createClient();
    
var MDBGame = require("./mdbgame.js");

// --- body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- Setup static
app.use(express.static(__dirname + "/client"));

// --- Routes
app.get("/", function(req, res){
    res.sendFile("index.html");
});

// Join a game by ID or create a new game
app.post("/join", function(req,res){
    var ip = req.connection.remoteAddress;
    
    var username = "kyle";
    var roomID = req.body.room_id;
    if (roomID) {
        log.info(ip + " - " + username + " trying to connect to room '" + roomID + "'");
        var username = req.body.username;
    }
    
    // Get the rooms out of redis and let the player join that.
    client.hlen("room:" + roomID, function(err, len){
        console.log(len);
    });
});

// --- Socket IO
io.on("connection", function(socket){
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
                var cardsPopulated = 0;
                var goldCards = obj["gold"];
                goldCards.forEach(function(card){
                    cardsPopulated++;
                    client.hset("gold:" + card["id"], "text", card["text"]);
                });
                log.info("Gold cards populated - " + cardsPopulated);
                
                cardsPopulated = 0;
                var triggerCards = obj["trigger"];
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