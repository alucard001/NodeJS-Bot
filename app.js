/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/
require('dotenv').config();

const restify = require('restify');
const bot = require("./bot.js");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Listen for messages from users
server.post('/api/messages', bot.connector('*').listen());