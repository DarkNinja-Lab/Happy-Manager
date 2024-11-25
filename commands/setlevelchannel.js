const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlevelchannel')
        .setDescription('Setzt den Kanal für Level-Aufstiege.')
        .addChannelOption(option =>
            option.setName('channel').setDescription('Der Kanal für Level-Up-Nachrichten').setRequired(true)
        ),
    async execute(interaction) {
        // Überprüfen, ob der Benutzer Administrator ist
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Du benötigst Administrator-Rechte, um diesen Befehl zu verwenden.',
                ephemeral: true,
            });
        }

        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;

        try {
            // Speichern des Level-Kanals in der Datenbank
            await db.query(
                'INSERT INTO level_settings (guild_id, level_channel_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE level_channel_id = ?',
                [guildId, channel.id, channel.id]
            );

            await interaction.reply({
                content: `✅ Der Level-Kanal wurde erfolgreich auf ${channel.name} gesetzt.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('❌ Fehler beim Setzen des Level-Kanals:', error);
            interaction.reply({
                content: '❌ Es gab einen Fehler beim Setzen des Level-Kanals. Bitte versuche es später erneut.',
                ephemeral: true,
            });
        }
    },
};
