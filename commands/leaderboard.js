const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Zeigt die Rangliste der Top-Level-Spieler auf diesem Server.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        try {
            // Hole die Top-10-Spieler aus der Datenbank basierend auf Level und Punkten
            const leaderboard = await db.query(
                `SELECT user_id, level, points
                 FROM levels
                 WHERE guild_id = ?
                 ORDER BY level DESC, points DESC
                 LIMIT 10`,
                [guildId]
            );

            if (leaderboard.length === 0) {
                return interaction.reply({
                    content: '❌ Es gibt noch keine Spieler in der Rangliste. Sei der Erste und sammel Punkte! 🚀',
                    ephemeral: true,
                });
            }

            // Erstelle das Leaderboard-Embed
            const leaderboardEmbed = new EmbedBuilder()
                .setColor('#00FF00') // Grüne Farbe für bessere Lesbarkeit
                .setTitle('🏆 **Top 10 Rangliste**')
                .setDescription('Die besten Spieler auf diesem Server:')
                .setFooter({ text: 'Sammle Punkte, um in der Rangliste aufzusteigen! 🚀' })
                .setTimestamp();

            // Emojis für die Top 3 Plätze
            const rankEmojis = ['🥇', '🥈', '🥉'];

            // Spieler zur Rangliste hinzufügen
            let leaderboardContent = '';
            leaderboard.forEach((entry, index) => {
                const user = interaction.client.users.cache.get(entry.user_id) || { username: 'Unbekannt' };
                const rankEmoji = rankEmojis[index] || `#${index + 1}`;
                leaderboardContent += `${rankEmoji} **${user.username}**\n` +
                    `   - Level: **${entry.level}** | Punkte: **${entry.points}**\n\n`;
            });

            leaderboardEmbed.setDescription(leaderboardContent.trim());

            // Sende die Rangliste
            return interaction.reply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('❌ Fehler beim Abrufen der Rangliste:', error);
            return interaction.reply({
                content: '❌ Es gab einen Fehler beim Abrufen der Rangliste. Bitte versuche es später erneut.',
                ephemeral: true,
            });
        }
    },
};
