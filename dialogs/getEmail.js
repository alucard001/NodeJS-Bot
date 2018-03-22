'use strict';

const builder = require('botbuilder');

module.exports = [
    function(session, args){
        // session.userData.email_args = args;
        // session.save();

        if(args && args.is_email == false){
            builder.Prompts.text(session, "電郵地址好像不對啊?  能不能再輸入一次？");
        }else{
            builder.Prompts.text(session, `最後，${session.userData.name}，你的電郵地址是?`);
        }
    },
    function(session, result){
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let is_email = pattern.test(result.response);

        if(is_email){
            session.userData.email = result.response;
            session.endDialog();
        }else{
            session.replaceDialog("getEmail", {'is_email': false});
        }
    }
];
