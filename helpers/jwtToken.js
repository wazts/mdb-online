// jwtToken.js

var jwt = require('jsonwebtoken');

// The secret, shhh
var jwt_secret = process.env.JWT_SECRET || "secret";

/**
 * Generate a token for a user
 */
exports.generateToken = function(userID, roomID) {
    var data = {
        "userID": userID,
        "roomID": roomID
    };
    return jwt.sign(data, jwt_secret);
}

/**
 * Verifies the token and decodes
 * @return Payload if valid, null is invalid.
 */
exports.decodeToken = function(token) {
    try {
        jwt.verify(token, jwt_secret);
    } catch (err) {
        return null;
    }
    
    return jwt.decode(token);
}