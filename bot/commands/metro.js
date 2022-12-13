const { SlashCommandBuilder } = require('discord.js');
var request = require('request')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkmetro')
		.setDescription('Check metro station, and get information of metro.'),
	async execute(interaction) {
		
		await interaction.reply('Pong!');
	},
};
