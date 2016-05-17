// MDB Client

// --- Socket IO
/* global io */
var socket = io();

exports.startGame = function(username, roomID, jwt){
    // --- Set up socket functions
    console.log(username + " is connecting to room " + roomID);
    socket.on("clientJoinedGame", clientJoinedGame);
};

function clientJoinedGame(data){
    console.log(data);
    $("#messages").append(data["token"]);
}
