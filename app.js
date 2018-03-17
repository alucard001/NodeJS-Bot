/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
 * Bot Storage: This is a great spot to register the private state storage for your bot. 
 * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
 * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
 * ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({
    gzipData: false
}, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({
        recognizers: [recognizer]
    })
    .matches('Greeting', (session) => {
        session.send('You reached Greeting intent, you said \'%s\'.', session.message.text);
    })
    .matches('Help', (session) => {
        session.send('You reached Help intent, you said \'%s\'.', session.message.text);
    })
    .matches('Cancel', (session) => {
        session.send('You reached Cancel intent, you said \'%s\'.', session.message.text);
    })
    .matches('Note.Create', [(session, args, next) => {
            // Resolve and store any Note.Title entity passed from LUIS.
            var intent = args.intent;
            var title = builder.EntityRecognizer.findEntity(intent.entities, 'Note.Title');

            var note = session.dialogData.note = {
                title: title ? title.entity : null,
            };

            // Prompt for title
            if (!note.title) {
                builder.Prompts.text(session, 'What would you like to call your note?');
            } else {
                next();
            }
        },
        (session, results, next) => {
            var note = session.dialogData.note;
            if (results.response) {
                note.title = results.response;
            }

            // Prompt for the text of the note
            if (!note.text) {
                builder.Prompts.text(session, 'What would you like to say in your note?');
            } else {
                next();
            }
        },
        (session, results) => {
            var note = session.dialogData.note;
            if (results.response) {
                note.text = results.response;
            }

            // If the object for storing notes in session.userData doesn't exist yet, initialize it
            if (!session.userData.notes) {
                session.userData.notes = {};
                console.log("initializing session.userData.notes in CreateNote dialog");
            }
            // Save notes in the notes object
            session.userData.notes[note.title] = note;

            // Send confirmation to user
            session.endDialog('Creating note named "%s" with text "%s"',
                note.title, note.text);
        }
    ])
    .matches('Note.Delete', [(session, args, next) => {
            if (noteCount(session.userData.notes) > 0) {
                // Resolve and store any Note.Title entity passed from LUIS.
                var title;
                var intent = args.intent;
                var entity = builder.EntityRecognizer.findEntity(intent.entities, 'Note.Title');
                if (entity) {
                    // Verify that the title is in our set of notes.
                    title = builder.EntityRecognizer.findBestMatch(session.userData.notes, entity.entity);
                }

                // Prompt for note name
                if (!title) {
                    builder.Prompts.choice(session, 'Which note would you like to delete?', session.userData.notes);
                } else {
                    next({
                        response: title
                    });
                }
            } else {
                session.endDialog("No notes to delete.");
            }
        },
        (session, results) => {
            delete session.userData.notes[results.response.entity];
            session.endDialog("Deleted the '%s' note.", results.response.entity);
        }
    ])
    .matches('Note.ReadAloud', [(session, args, next) => {
            if (noteCount(session.userData.notes) > 0) {

                // Resolve and store any Note.Title entity passed from LUIS.
                var title;
                var intent = args.intent;
                var entity = builder.EntityRecognizer.findEntity(intent.entities, 'Note.Title');
                if (entity) {
                    // Verify it's in our set of notes.
                    title = builder.EntityRecognizer.findBestMatch(session.userData.notes, entity.entity);
                }

                // Prompt for note name
                if (!title) {
                    builder.Prompts.choice(session, 'Which note would you like to read?', session.userData.notes);
                } else {
                    next({
                        response: title
                    });
                }
            } else {
                session.endDialog("No notes to read.");
            }
        },
        (session, results) => {
            session.endDialog("Here's the '%s' note: '%s'.", results.response.entity, session.userData.notes[results.response.entity].text);
        }
    ])
    /*
    .matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
    */
    .onDefault((session) => {
        session.send('Sorry, I did not understand \'%s\'.', session.message.text);
    });

bot.dialog('/', intents);

// Helper function to count the number of notes stored in session.userData.notes
function noteCount(notes) {
    var i = 0;
    for (var name in notes) {
        i++;
    }
    return i;
}