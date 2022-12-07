const { SlashCommandBuilder } = require('discord.js');
var langutil = require('./util/lang_util/langutil.js');


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
        let translate_con = interaction.options._hoistedOptions[1];
        let comm = interaction.options._hoistedOptions[0].split(' ');
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

        if(flags.papago)
        {

        }

        let return_string = langclass.replaceStringVal(langclass.getLangStr(3),
        ['','','']);
        console.log(interaction.options._hoistedOptions)
		await interaction.reply(return_string);
	},
};