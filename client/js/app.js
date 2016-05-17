/* global $ */
/* global io */

var $ = require('jquery');
var client = require('./mdbClient.js');
var token = "";

// --- Add actions
$("form#join-game-form").submit(hostJoinGame);

/**
 * We want to join a game
 */
function hostJoinGame() {
    console.log('Sending join game request');

    var data = {}
    data._csrf = $("input#join_csrf").val();
    data.username = $("input#username").val();

    var roomID = $('input#gameName').val();
    if (roomID != "") {
        console.log("Trying to connect to room '" + roomID + "'");
        data["room_id"] = roomID;
    }

    $.post("/join", data, function(res, status) {
        if (status == "success"){
            
            client.startGame(res.username, res.roomID, res.token);
        }
    });
    $('input#gameName').val('');
    return false;
}
