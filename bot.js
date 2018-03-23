'use strict';

require('dotenv').config();

const builder = require('botbuilder');
const azure_storage = require("./azure_storage")
const luis = require("./luis")

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata || ''
});

// Create your bot with a function to receive messages from the user
const bot = module.exports = new builder.UniversalBot(connector);
bot.set('storage', azure_storage.tableStorage);

// Intercept message: https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-intercept-messages
// bot.use({
//     receive: function(event, next){
//         next();
//     },
//     botbuilder: function(session, next){
//         next();
//     },
//     send: function(event, next){
//         next();
//     }
// });

const intents = new builder.IntentDialog({ recognizers: [luis] })
    .matches('ESD_BodyCheck', [
        (session, args, next) => {
            session.beginDialog('bodycheck_buying_guide');
        },
        function (session, args, next) {
            session.beginDialog('demoDialog');
            // No need to add next() here
            // next();
        },
        function (session, args, next) {
            session.beginDialog('bodycheck_survey');
        },
        function (session, result, next) {
            console.log(result);
            let thankyou = result.response;
            if (result.is_interested){
                thankyou = "你的資料我們已妥善並安全地保存。放心。我們的同事稍後會聯絡你。多謝你聯絡生活易。Bye Bye.";
            }
            session.endConversation(thankyou);
        }
    ])
    .onDefault((session) => {
        let text = session.message.text;
        session.send([
            `Sorry, I did not understand: ${text}`,
            `抱歉，我不太明白什麼是: ${text}`
        ]);
    })
    .triggerAction({
        matches: /^esd$/i,
        // intentThreshold: 0.0,
        onSelectAction: (session, args, next) => {
            console.log("run esd");
        }
    });

bot.dialog('bodycheck_survey', require("./dialogs/bodycheck_survey"));
bot.dialog('getEmail', require("./dialogs/getEmail"));
bot.dialog('bodycheck_buying_guide', require("./dialogs/bodycheck_buying_guide"));
bot.dialog('demoDialog', require("./dialogs/demo"));

bot.dialog('/', intents);
