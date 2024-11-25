const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlevelrole')
        .setDescription('Setzt die Rolle, die bei einem bestimmten Level vergeben wird.')
        .addRoleOption(option =>
            option
                .setName('rolle')
                .setDescription('Die Rolle, die vergeben werden soll.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('level')
                .setDescription('Das Level, ab dem die Rolle vergeben wird.')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Nur Administratoren dürfen diesen Befehl ausführen
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ Du benötigst Administrator-Rechte, um diesen Befehl auszuführen.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const role = interaction.options.getRole('rolle');
        const level = interaction.options.getInteger('level');

        if (level < 1) {
            return interaction.reply({ content: '❌ Das Level muss mindestens 1 sein.', ephemeral: true });
        }

        try {
            // Speichere die Rolle und das Level in der Datenbank
            await db.query(
                `INSERT INTO level_roles (guild_id, role_id, required_level)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE role_id = ?, required_level = ?`,
                [guildId, role.id, level, role.id, level]
            );

            interaction.reply({
                content: `✅ Die Rolle **${role.name}** wird ab Level **${level}** vergeben.`,
            });
        } catch (error) {
            console.error('❌ Fehler beim Festlegen der Levelrolle:', error);
            interaction.reply({ content: '❌ Es gab einen Fehler beim Speichern der Daten. Bitte versuche es erneut.', ephemeral: true });
        }
    },
};
