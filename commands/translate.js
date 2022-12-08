const { SlashCommandBuilder } = require('discord.js');
var langutil = require('./util/lang_util/langutil.js');
var ve  = require('./util/virture_env/virtureenv.js');
var request = require('request');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Translate message according to your setting.')
        .addStringOption(option =>
            option.setName('commands')
                .setDescription('Put lang code like: From > To or To'))
        .addStringOption(option =>
            option.setName('contents')
                .setDescription('the contents to translate')),
	async execute(interaction) {
        let translate_origin = interaction.locale;
        let langclass = new langutil(translate_origin);
        let lang_to = ''
        let translate_con = interaction.options._hoistedOptions[1].value;
        let comm = interaction.options._hoistedOptions[0].value.split(' ');
        if(comm[0].includes('>'))
        {
            let cods = comm[0].split('>');
            lang_to = cods[1];
            translate_origin = cods[0];
        }
        else
        {
            lang_to = comm[0];
        }
        let flags = {};
        if(comm.length>1)
        {
            for(let i=1;i<comm.length;i++)
            {
                switch(comm[i])
                {
                    case '-p' : flags.papago = true; break;
                    default:break;
                }
            }
        }
        let vee = new ve();
        let translated_text = '';
        if(flags.papago)
        {
            var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
            var options = {
                url: api_url,
                form: {'source':translate_origin, 'target':lang_to, 'text':translate_con},
                headers: {'X-Naver-Client-Id':vee.virtureenv('papagoID'), 'X-Naver-Client-Secret': vee.virtureenv('papagoSe')}
             };
             request.post(options, function (error, response, body) 
             {
                if (!error && response.statusCode == 200) 
                {
                    translated_text = JSON.parse(body).message.result.translatedText;
                    end();
                }
                else 
                {
                    console.log('papago: error = ' + response.statusCode);
                    let err_msg = '';
                    if(error)err_msg = JSON.parse(error).errorMessage;
                    interaction.reply('ERROR! : '+response.statusCode+"/"+err_msg);
                    return;
                }
            })

        }
        else
        {
            await interaction.reply(langclass.getLangStr('dev'));
            return;
        }
        async function end()
        {
            let return_string = langclass.replaceStringVal(langclass.getLangStr(3),
            [translate_origin,lang_to,translated_text]);
            await interaction.reply(return_string);
        }
       
	},
};