const http = require('http');
const path = require('node:path');
const { Collection,Client, GatewayIntentBits,SlashCommandBuilder,Events, REST, Routes } = require('discord.js');
const client = new Client({ 
    intents: 
    [ 
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ] });
const fs = require('fs');


/**
 * Discord bot server
 */
client.commands = new Collection() 
//http.createServer(function (request, response) {}).listen(process.env.PORT||5000); // FOR HEROKU.
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

http.createServer(function (request, response) 
{}).listen(process.env.PORT||5005,()=>{});
client.on('ready',()=>{console.log('ready!')})

// Log in to Discord with your client's token
client.login(process.env.TOKEN);// 토큰 수정
