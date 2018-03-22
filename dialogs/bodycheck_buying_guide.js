const builder = require("botbuilder");

let card = '',
    msg = '';

module.exports = [
    function(session, result, next){
        session.send("購買身體檢查流程如下：\n1. 選取你想購買的身體檢查及按「購買」");

        card = new builder.HeroCard(session)
            .title('1. 選取你想購買的身體檢查及按「購買」')
            .images([
                builder.CardImage.create(session, 'https://www.lksf.org/bot/1.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.lksf.org/bot/1.png', '放大')
            ]);
        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        session.send('2. 選擇你的免費及附加項目 (適用於有相關選項的身體檢查)');
        card = new builder.HeroCard(session)
            .title('2. 選擇你的免費及附加項目 (適用於有相關選項的身體檢查)')
            .images([
                builder.CardImage.create(session, 'https://www.lksf.org/bot/2.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.lksf.org/bot/2.png', '放大')
            ]);
        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);

        session.send('3. 選擇你的免費禮品(適用於有相關選項的身體檢查)，之後按「確認」至下一頁填寫資料。如你想選購其他產品，可先按「儲存繼續選購」。');
        card = new builder.HeroCard(session)
            .title('3. 選擇你的免費禮品(適用於有相關選項的身體檢查)，之後按「確認」至下一頁填寫資料。如你想選購其他產品，可先按「儲存繼續選購」。')
            .images([
                builder.CardImage.create(session, 'https://www.lksf.org/bot/3.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.lksf.org/bot/3.png', '放大')
            ]);
        msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        next();
    }
];