const { SlashCommandBuilder } = require('discord.js');
var langutil = require('./util/lang_util/langutil.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('show_github')
		.setDescription('show github repogistry'),
	async execute(interaction) {
        let langclass = new langutil(interaction.locale)
        let return_string = langclass.replaceStringVal(langclass.getLangStr(2),['https://github.com/LuticaCANARD/Lutica_canard_nodejs_discordbot ']);
		await interaction.reply(return_string);
	},
};