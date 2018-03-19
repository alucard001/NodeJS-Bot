/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/
require('dotenv').config();

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
    openIdMetadata: process.env.BotOpenIdMetadata || ''
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
 * Bot Storage: This is a great spot to register the private state storage for your bot.
 * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
 * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
 * ---------------------------------------------------------------------------------------- */

//  Azure storage
var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({
    gzipData: false
}, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

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

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;

var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
    .matches('ESD_BodyCheck', [
        (session, args, next) => {

            session.send('購買身體檢查流程如下：');

            session.send('1. 選取你想購買的身體檢查及按「購買」');
            var card = new builder.HeroCard(session)
                .title('1. 選取你想購買的身體檢查及按「購買」')
                .images([
                    builder.CardImage.create(session, 'http://203.184.176.136/bot/1.png')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'http://203.184.176.136/bot/1.png', '放大')
                ]);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('2. 選擇你的免費及附加項目 (適用於有相關選項的身體檢查)');
            var card = new builder.HeroCard(session)
                .title('2. 選擇你的免費及附加項目 (適用於有相關選項的身體檢查)')
                .images([
                    builder.CardImage.create(session, 'http://203.184.176.136/bot/2.png')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'http://203.184.176.136/bot/2.png', '放大')
                ]);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('3. 選擇你的免費禮品(適用於有相關選項的身體檢查)，之後按「確認」至下一頁填寫資料。如你想選購其他產品，可先按「儲存繼續選購」。');
            var card = new builder.HeroCard(session)
                .title('3. 選擇你的免費禮品(適用於有相關選項的身體檢查)，之後按「確認」至下一頁填寫資料。如你想選購其他產品，可先按「儲存繼續選購」。')
                .images([
                    builder.CardImage.create(session, 'http://203.184.176.136/bot/3.png')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'http://203.184.176.136/bot/3.png', '放大')
                ]);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            // --------------------------------------------------------
            // --------------------------------------------------------
            // A lot of demo belows:
            session.send('以下是Demo - Hero Card:');
            var card = new builder.HeroCard(session)
                .title('BotFramework Hero Card')
                .subtitle('Your bots — wherever your users are talking')
                .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
                .images([
                    builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
                ]);

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('以下是Demo - Thumbnail Card:');
            var card = new builder.ThumbnailCard(session)
                .title('BotFramework Thumbnail Card')
                .subtitle('Your bots — wherever your users are talking')
                .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
                .images([
                    builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
                ]);

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('以下是Demo - ReceiptCard Card: 買東西用的');
            var order = 1234;
            var card = new builder.ReceiptCard(session)
                .title('John Doe')
                .facts([
                    builder.Fact.create(session, order++, 'Order Number'),
                    builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
                ])
                .items([
                    builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
                        .quantity(368)
                        .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
                    builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
                        .quantity(720)
                        .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
                ])
                .tax('$ 7.50')
                .total('$ 90.95')
                .buttons([
                    builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
                        .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
                ]);

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('以下是Demo - Signin Card:');
            var card = new builder.SigninCard(session)
                .text('BotFramework Sign-in Card')
                .button('Sign-in', 'https://login.microsoftonline.com');

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('以下是Demo - Animation Card:');
            var card = new builder.AnimationCard(session)
                .title('Microsoft Bot Framework')
                .subtitle('Animation Card')
                .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
                .media([
                    { url: 'http://i.giphy.com/Ki55RUbOV5njy.gif' }
                ]);

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('以下是Demo - Video Card:');
            var card = new builder.VideoCard(session)
                .title('Big Buck Bunny')
                .subtitle('by the Blender Institute')
                .text('Big Buck Bunny (code-named Peach) is a short computer-animated comedy film by the Blender Institute, part of the Blender Foundation. Like the foundation\'s previous film Elephants Dream, the film was made using Blender, a free software application for animation made by the same foundation. It was released as an open-source film under Creative Commons License Attribution 3.0.')
                .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
                .media([
                    { url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4' }
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://peach.blender.org/', 'Learn More')
                ]);

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send('以下是Demo - Audio Card:');
            var card = new builder.AudioCard(session)
                .title('I am your father')
                .subtitle('Star Wars: Episode V - The Empire Strikes Back')
                .text('The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leigh Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing the film\'s story and serving as executive producer. The second installment in the original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. and stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.')
                .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
                .media([
                    { url: 'http://www.wavlist.com/movies/004/father.wav' }
                ])
                .buttons([
                    builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back', 'Read More')
                ]);

            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            // --------------------------------------------------------
            // --------------------------------------------------------

            next();
        },
        (session, args, next) => {
            // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptschoice
            builder.Prompts.choice(session, "你打算買身體檢查嗎？", ['是的', '不用，謝謝。'], {
                maxRetries: 3,
                retryPrompt: "抱歉我不明白你的意思。能再說一遍嗎？",
                listStyle: 3
            });
        },
        (session, result, next) => {
            // session.userData.isbought = result;
            // result: {"isbought":{"resumed":0,"response":{"index":0,"entity":"是的","score":1},"childId":"BotBuilder:prompt-choice"}}
            // session.save();
            if (result.response.index == 0){
                next();
            }else{
                session.endDialog("沒問題。下次見。");
                session.endConversation();
            }
        },
        (session, result, next) => {
            builder.Prompts.text(session, "借問點稱呼？");
        },
        (session, result, next) => {
            session.userData.name = result.response;
            session.send(`好的。 ${result.response}。在推介之前，為了明白你的真正需要，請你回答幾個問題。`);
            next();
        },
        (session, result, next) => {
            builder.Prompts.number(session, "請問你的年齡是?");
        },
        (session, result, next) => {
            session.userData.age = result.response;
            builder.Prompts.choice(session, `好的。${session.userData.name}, 你是男性或是女性?`, ["男性", "女性"], {
                maxRetries: 3,
                retryPrompt: "抱歉我不明白你的意思。你出生時的性別你不知道嗎？",
                listStyle: 3
            });
        },
        (session, result, next) => {
            if (result.response.index == 1){
                session.userData.gender = "男";
            }else{
                session.userData.gender = "女";
            }
            builder.Prompts.confirm(session, "有吸煙習慣嗎？", ["有", "沒有"]);
        },
        (session, result, next) => {
            session.userData.isSmokingReturn = result;
            session.save();
            if (result.response.index == 1){
                session.userData.isSmoking = true;
            }else{
                session.userData.isSmoking = false;
            }
            builder.Prompts.confirm(session, `明白。${session.userData.name}。有飲酒習慣嗎？`, ["有", "沒有"]);
        },
        (session, result, next) => {
            session.userData.isDrinkingReturn = result;
            session.save();

            session.userData.isDrinking = result.response.index;
            if (result.response.index == 1) {
                session.userData.isDrinking = true;
            } else {
                session.userData.isDrinking = false;
            }
            builder.Prompts.text(session, "就快完成了。請問您有任何家族病史嗎？");
        },
        (session, result, next) => {
            session.userData.family_illness_history = result.response;
            session.beginDialog("getEmail", {'is_correct_email': true});
            next();
        },
        (session, result, next) => {
            let name = session.userData.name;
            let age = session.userData.age;
            let gender = session.userData.gender;
            let isSmoking = session.userData.isSmoking && '有吸煙習慣' || '沒有吸煙習慣';
            let isDrinking = session.userData.isDrinking && '有飲酒習慣' || '沒有飲酒習慣';
            let email = session.userData.email;
            session.save();

            let finalMsg = `好的。${name}。你今年 ${age} 歲，${gender}，${isSmoking}，${isDrinking}。電郵地址是：${email}。`;
            session.send(finalMsg);

            session.endConversation("你的資料我們已妥善並安全地保存。放心。我們的同事稍後會聯絡你。多謝你聯絡生活易。Bye Bye.");
        }
    ])
    .onDefault((session) => {
        let text = session.message.text;
        session.send([
            `Sorry, I did not understand: ${text}`,
            `抱歉，我不太明白什麼是: ${text}`
        ]);
    }).triggerAction({
        matches: /^esd$/i,
        onSelectAction: (session, args, next) => {
            console.log("run esd");
        }
    });

bot.dialog('getEmail', [
    function(session, args){
        // session.userData.email_args = args;
        // session.save();

        // if(args && args.is_email == false){
        //     builder.Prompts.text(session, "電郵地址好像不對啊?  能不能再輸入一次？");
        // }else{
            builder.Prompts.text(session, `最後，${session.userData.name}，你的電郵地址是?`);
        // }
    },
    function(session, result){
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let is_email = pattern.test(result.response);

        if(is_email){
            session.userData.email = result.response;
        }else{
            session.replaceDialog("getEmail", {'is_email': false});
        }
    }
]).triggerAction({
    matches: /^email$/i,
    onSelectAction: (session, args, next) => {
        console.log("run email");
    }
});

bot.dialog('/', intents).triggerAction({
    matches: /^esd$/i,
    onSelectAction: (session, args, next) => {
        console.log("run root");
    }

});