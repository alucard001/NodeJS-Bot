'use strict';

const builder = require('botbuilder');
let card = '';
let msg = '';

module.exports = [
    function (session, results, next){
        // A lot of demo belows:
        session.send('以下是Demo - Hero Card:');
        card = new builder.HeroCard(session)
            .title('BotFramework Hero Card')
            .subtitle('Your bots — wherever your users are talking')
            .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
            .images([
                builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
            ]);

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }, function (session, results, next) {
        session.send('以下是Demo - Thumbnail Card:');
        card = new builder.ThumbnailCard(session)
            .title('BotFramework Thumbnail Card')
            .subtitle('Your bots — wherever your users are talking')
            .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
            .images([
                builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
            ]);

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }, function (session, results, next) {
        session.send('以下是Demo - ReceiptCard Card: 買東西用的');
        var order = 1234;
        card = new builder.ReceiptCard(session)
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

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }, function (session, results, next) {

        session.send('以下是Demo - Signin Card:');
        card = new builder.SigninCard(session)
            .text('BotFramework Sign-in Card')
            .button('Sign-in', 'https://login.microsoftonline.com');

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }, function (session, results, next) {

        session.send('以下是Demo - Animation Card:');
        card = new builder.AnimationCard(session)
            .title('Microsoft Bot Framework')
            .subtitle('Animation Card')
            .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
            .media([
                { url: 'https://i.giphy.com/Ki55RUbOV5njy.gif' }
            ]);

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }, function (session, results, next) {

        session.send('以下是Demo - Video Card:');
        card = new builder.VideoCard(session)
            .title('Big Buck Bunny')
            .subtitle('by the Blender Institute')
            .text('Big Buck Bunny (code-named Peach) is a short computer-animated comedy film by the Blender Institute, part of the Blender Foundation. Like the foundation\'s previous film Elephants Dream, the film was made using Blender, a free software application for animation made by the same foundation. It was released as an open-source film under Creative Commons License Attribution 3.0.')
            .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
            .media([
                { url: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://peach.blender.org/', 'Learn More')
            ]);

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }, function (session, results, next) {
        session.send('以下是Demo - Audio Card:');
        card = new builder.AudioCard(session)
            .title('Sound Examples')
            .subtitle('Plucked and Struck Acoustic Strings')
            .text('Plucked/Struck Strings (NeXT Computer, 1989)')
            .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
            .media([
                {
                    url: 'https://ccrma.stanford.edu/~jos/mp3/bachfugue.mp3'
                }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back', 'Read More')
            ]);

        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        session.endDialog();
    }
];