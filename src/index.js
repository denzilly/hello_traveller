import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { DISCORD_TOKEN, WELCOME_CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in your environment/.env file.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}. Ready to greet travellers!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    const errorReply = { content: 'Something went wrong running that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorReply);
    } else {
      await interaction.reply(errorReply);
    }
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const channel = WELCOME_CHANNEL_ID
    ? await member.guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null)
    : member.guild.systemChannel;

  if (!channel || !channel.isTextBased()) return;

  await channel.send(`Welcome to the server, ${member}! Safe travels. 🧭✨`);
});

client.login(DISCORD_TOKEN);
