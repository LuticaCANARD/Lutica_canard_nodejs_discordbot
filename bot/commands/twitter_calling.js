const { SlashCommandBuilder } = require('discord.js');
var request = require('request')
var langutil = require('./util/lang_util/langutil.js');

const twitter_codes = 1211259596062355456;
const twitter_id = "presan100_VRC"
module.exports = {
	data: new SlashCommandBuilder()
		.setName('last_twit_vrc')
		.setDescription('searching Cana\'s twitter, and get he\'s last twit'),
	async execute(interaction) {
		const optionrequest = 
        {
            headers:
            {
                Authorization:'Bearer '+process.env.TWITTER_AUTH
            },
            uri : "https://api.twitter.com/2/tweets/search/recent?query=from:"+twitter_id
            +" -RT -is:reply&tweet.fields=created_at&expansions=author_id&user.fields=created_at"
        }
        request(optionrequest,function(err,rep,body)
        {
            var langclass = new langutil(interaction.locale)
            if(rep.statusCode==200)
            {
                let vimpel = JSON.parse(body)
                let strk = langclass.getLangStr(1);
                let send_str = langclass.replaceStringVal(strk,['https://twitter.com/'+twitter_id+'/status/'+vimpel.data[0].id+' '])
                interaction.reply(send_str)
            }
            else
            {
                let send_str = langclass.getLangStr('error');
                console.log(err);
                interaction.reply(send_str)
            }
           
        })

		
	},
};
