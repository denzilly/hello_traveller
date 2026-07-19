import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription("Check the bot's latency");

export async function execute(interaction) {
  const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  await interaction.editReply(`Pong! Roundtrip latency: ${latency}ms. WebSocket ping: ${interaction.client.ws.ping}ms.`);
}
