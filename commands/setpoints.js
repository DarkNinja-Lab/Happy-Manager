const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpoints')
        .setDescription('Setzt die Punkte für den nächsten Level-Aufstieg.')
        .addIntegerOption(option =>
            option.setName('points').setDescription('Die Anzahl an Punkten für das nächste Level').setRequired(true)
        ),
    async execute(interaction) {
        // Überprüfen, ob der Benutzer Administrator ist
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Du benötigst Administrator-Rechte, um diesen Befehl zu verwenden.',
                ephemeral: true,
            });
        }

        const points = interaction.options.getInteger('points');
        const guildId = interaction.guild.id;

        try {
            // Speichern der Punkte für den nächsten Levelaufstieg in der Datenbank
            await db.query(
                'INSERT INTO level_settings (guild_id, points_to_next_level) VALUES (?, ?) ON DUPLICATE KEY UPDATE points_to_next_level = ?',
                [guildId, points, points]
            );

            await interaction.reply({
                content: `✅ Die Punkte für den nächsten Levelaufstieg wurden auf ${points} gesetzt.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('❌ Fehler beim Setzen der Punkte:', error);
            interaction.reply({
                content: '❌ Es gab einen Fehler beim Setzen der Punkte. Bitte versuche es später erneut.',
                ephemeral: true,
            });
        }
    },
};
