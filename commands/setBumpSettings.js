const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbumpsettings')
        .setDescription('Setzt die Rolle und den Kanal für Bump-Erinnerungen.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Die Rolle, die gepingt werden soll.')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Der Kanal, in dem die Nachricht gesendet werden soll.')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Berechtigungsprüfung: Nur Administratoren können den Befehl verwenden
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ Du benötigst Administrator-Rechte, um diesen Befehl zu verwenden.',
                ephemeral: true,
            });
        }

        const role = interaction.options.getRole('role');
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;

        if (channel.type !== 0) { // Überprüfen, ob der Kanal ein Textkanal ist
            return interaction.reply({
                content: '❌ Der angegebene Kanal ist kein Textkanal.',
                ephemeral: true,
            });
        }

        try {
            // Speichern von Rolle und Kanal in der Datenbank
            await db.query(
                'INSERT INTO bump_settings (guild_id, role_id, channel_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role_id = ?, channel_id = ?',
                [guildId, role.id, channel.id, role.id, channel.id]
            );

            await interaction.reply({
                content: `✅ Die Rolle ${role.name} und der Kanal ${channel.name} wurden erfolgreich für Bump-Erinnerungen festgelegt.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('❌ Fehler beim Setzen der Bump-Einstellungen:', error);
            interaction.reply({
                content: '❌ Es gab einen Fehler beim Speichern der Einstellungen. Bitte versuche es später erneut.',
                ephemeral: true,
            });
        }
    },
};
