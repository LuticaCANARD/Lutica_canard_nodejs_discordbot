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
        let lang_to = interaction.locale;
        let langclass = new langutil(lang_to);
        let translate_origin = ''
        let flags = 
        {
            papago : true
        };
        let translate_con ='';
        if(interaction.options._hoistedOptions[0].name=="contents")
        {
            translate_con = interaction.options._hoistedOptions[0].value;
            if(flags?.papago) flags.papago_detect = true; //임시 파일
        }
        else
        {
            if(interaction.options._hoistedOptions[0].value=='help')
            {
                await interaction.reply(langclass.getLangStr("tr_help"));
                return;
            }
            translate_con = interaction.options._hoistedOptions[1].value;
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
    
        }

       
        let vee = new ve();
        let translated_text = '';
        if(flags.papago)
        {
            if(flags.papago_detect)
            {
                var api_urlde = 'https://openapi.naver.com/v1/papago/detectLangs';
                var options = {
                    url: api_urlde,
                    form: {'query': translate_con},
                    headers: {'X-Naver-Client-Id':vee.virtureenv('papagoID'), 'X-Naver-Client-Secret': vee.virtureenv('papagoSe')}
                    };
                request.post(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                    translate_origin = JSON.parse(body).langCode;
                    translationPapago();
                    //console.log(translate_origin)
                    } else {
                    console.log('papago detecter error = ' + response.statusCode);
                    let err_msg = '';
                    if(error)err_msg = JSON.parse(error).errorMessage;
                    interaction.reply('ERROR! : '+response.statusCode+"/"+err_msg);
                    return;
                    }
                })
            }
            else
            {
                translationPapago();
            }

           
            function translationPapago()
            {
                //console.log(translate_origin)
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
        }
        else
        {
            // Imports the Google Cloud client library
            const {Translate} = require('@google-cloud/translate').v2;
            // Creates a client
            const translate = new Translate();
            /**
             * TODO(developer): Uncomment the following lines before running the sample.
             */
            const text = translate_con;
            const target = lang_to;

            async function translateText() {
            // Translates the text into the target language. "text" can be a string for
            // translating a single piece of text, or an array of strings for translating
            // multiple texts.
            let [translations] = await translate.translate(text, target);
            translations = Array.isArray(translations) ? translations : [translations];
            console.log('Translations:');
            translations.forEach((translation, i) => {
                console.log(`${text[i]} => (${target}) ${translation}`);
            });
            }

            translateText();


            await interaction.reply(langclass.getLangStr('dev'));
            return;
        }
        async function end()
        {
            let dis_or_lang = "la_"+translate_origin;
            let dis_to_lang = "la_"+lang_to;
            let return_string = langclass.replaceStringVal(langclass.getLangStr(3),
            [langclass.getLangStr(dis_or_lang),langclass.getLangStr(dis_to_lang),translated_text]);
            await interaction.reply(return_string);
        }
       
	},
};