import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('Missing DISCORD_TOKEN or CLIENT_ID in your environment/.env file.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(DISCORD_TOKEN);

try {
  console.log(`Registering ${commands.length} slash command(s)...`);

  const route = GUILD_ID
    ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
    : Routes.applicationCommands(CLIENT_ID);

  await rest.put(route, { body: commands });

  console.log(
    GUILD_ID
      ? `Registered commands to guild ${GUILD_ID} (instant).`
      : 'Registered global commands (may take up to an hour to appear).'
  );
} catch (error) {
  console.error(error);
}
