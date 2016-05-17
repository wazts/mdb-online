/* global $ */
/* global io */

var socket = io();
var token = "";

// --- Set up socket functions
socket.on("clientJoinedGame", clientJoinedGame);

// --- Add actions
$("form#join-game-form").submit(hostJoinGame);

function clientJoinedGame(data){
    console.log(data);
    $("#messages").append(data["token"]);
}

/** 
 * We want to join a game
 */
function hostJoinGame() {
    console.log('Sending join game request');
    var roomID = $('input#gameName').val();
    
    var data = {}
    if (roomID != "") {
        console.log("Trying to connect to room '" + roomID + "'");
        data["room_id"] = roomID;
    }
    
    $.post("/join", data);
    $('input#gameName').val('');
    return false;
}
