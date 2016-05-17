var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "MDB"});

module.exports = log;