import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Say hello to a fellow traveller');

export async function execute(interaction) {
  await interaction.reply(`Hello there, ${interaction.user.username}! Safe travels. 🧭`);
}
