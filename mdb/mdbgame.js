// mdbgame.js

"use strict";
var log = require('../helpers/logger.js');
var redis = require("redis"),
    client = redis.createClient(),
    pub = redis.createClient(),
    sub = redis.createClient();
var helper = require("../helpers/helpers.js");

exports.initGame = function(io, socket) {
    // --- Add connection stuff
    socket.on('hostJoinGame', hostJoinGame);

    // --- Redis Pub/Sub
    // sub.on('newMaster', subNewMaster);
}


function hostJoinGame(data) {
    log.info("Client joining game");
    console.log(data);
    var roomID = data["roomID"];
    if (roomID) {
        // Check for valid ID.
        if(client.get("room:" + roomID) === null){
            log.warning("Invalid room " + roomID);
            this.exit();
        }
    } else {
        // Create a room or try to join an existing room
    }
    this.emit("clientJoinedGame", {"clientID": "hello"})
}
