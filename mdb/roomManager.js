// roomManager.js

/**
 * All the functions that relate to creating and managing rooms.
 */

// --- IMPORTS
var redis = require("redis"),
    client = redis.createClient();


// -----------------------------------------------------------------------------
/**
 *
 * @param roomID The room we wish to try to enter
 * @param username If the room is available, we will lock the user in the room
 * @return bool Added the user to the room.
 */
exports.enterRoom = function(username, roomID) {
    roomID = roomID || null;

    // Check if we can enter the room if supplied.
    // Otherwise find a new room that we can enter.
    if (roomID) {

    } else {

    }
}
