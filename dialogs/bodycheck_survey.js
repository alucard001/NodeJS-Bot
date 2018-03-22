const builder = require("botbuilder");

let card = '',
    msg = '';

module.exports = [
    function (session, result, next) {
        // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptschoice
        builder.Prompts.choice(session, "你打算買身體檢查嗎？", ['是的', '不用，謝謝。'], {
            maxRetries: 3,
            retryPrompt: "抱歉我不明白你的意思。能再說一遍嗎？",
            listStyle: 3
        });
    },
    function (session, result, next) {
        // session.userData.isbought = result;
        // result: {"isbought":{"resumed":0,"response":{"index":0,"entity":"是的","score":1},"childId":"BotBuilder:prompt-choice"}}
        // session.save();
        if (result.response.index == 0) {
            next();
        } else {
            session.endDialogWithResult({ response: "沒問題。下次見。", is_interested: false});
        }
    },
    function (session, result, next) {
        builder.Prompts.text(session, "借問點稱呼？");
    },
    function (session, result, next) {
        session.userData.name = result.response;
        session.send(`好的。 ${result.response}。在推介之前，為了明白你的真正需要，請你回答幾個問題。`);
        next();
    },
    function (session, result, next) {
        builder.Prompts.number(session, "請問你的年齡是?");
    },
    function (session, result, next) {
        session.userData.age = result.response;
        builder.Prompts.choice(session, `好的。${session.userData.name}, 你是男性或是女性?`, ["男性", "女性"], {
            maxRetries: 3,
            retryPrompt: "抱歉我不明白你的意思。你出生時的性別你不知道嗎？",
            listStyle: 3
        });
    },
    function (session, result, next) {
        if (result.response.index == 0) {
            session.userData.gender = "男";
        } else {
            session.userData.gender = "女";
        }
        builder.Prompts.choice(session, "有吸煙習慣嗎？", ["有", "沒有"], {
            maxRetries: 3,
            retryPrompt: "抱歉我不明白你的意思。能再說一遍嗎？",
            listStyle: 3
        });
    },
    function (session, result, next) {
        // session.userData.isSmokingReturn = result;
        // session.save();

        if (result.response.index == 0) {
            session.userData.isSmoking = true;
        } else {
            session.userData.isSmoking = false;
        }
        builder.Prompts.choice(session, `明白。${session.userData.name}。有飲酒習慣嗎？`, ["有", "沒有"], {
            maxRetries: 3,
            retryPrompt: "抱歉我不明白你的意思。能再說一遍嗎？",
            listStyle: 3
        });
    },
    function (session, result, next) {
        // session.userData.isDrinkingReturn = result;
        // session.save();

        session.userData.isDrinking = result.response.index;
        if (result.response.index == 0) {
            session.userData.isDrinking = true;
        } else {
            session.userData.isDrinking = false;
        }
        builder.Prompts.text(session, "就快完成了。請問您有任何家族病史嗎？");
    },
    function (session, result, next) {
        session.userData.family_illness_history = result.response;
        session.beginDialog("getEmail", { 'is_correct_email': true });
        next();
    },
    function (session, result, next) {
        let name = session.userData.name;
        let age = session.userData.age;
        let gender = session.userData.gender;

        let isSmoking, isDrinking;

        if (session.userData.isSmoking) {
            isSmoking = "有吸煙習慣";
        } else {
            isSmoking = '沒有吸煙習慣';
        }

        if (session.userData.isDrinking) {
            isDrinking = '有飲酒習慣';
        } else {
            isDrinking = '沒有飲酒習慣';
        }

        let family_illness_history = session.userData.family_illness_history;

        let email = session.userData.email;
        session.save();

        let finalMsg = `好的。${name}。你今年 ${age} 歲，${gender}，${isSmoking}，${isDrinking}, 家族病史: ${family_illness_history}。電郵地址是：${email}。`;
        session.send(finalMsg);
        session.endDialogWithResult({is_interested: true});
    }
];