'use strict';

require('dotenv').load();

let tableName = '';
let tableStorage = '';

switch(process.env.environment){
    case 'prod':
        /*----------------------------------------------------------------------------------------
        * Bot Storage: This is a great spot to register the private state storage for your bot.
        * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
        * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
        * ---------------------------------------------------------------------------------------- */
        const botbuilder_azure = require("botbuilder-azure");

        //  Azure storage
        tableName = 'botdata';
        const azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
        tableStorage = new botbuilder_azure.AzureBotStorage({
            gzipData: false
        }, azureTableClient);
        break;
    case 'devel':
    default:
        const builder = require('botbuilder');
        tableStorage = new builder.MemoryBotStorage();
        break;
}

module.exports = {
    tableName: tableName,
    tableStorage: tableStorage
}