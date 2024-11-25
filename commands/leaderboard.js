const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Zeigt das Top-Level- und Punkt-Leaderboard des Servers an.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        try {
            // Datenbankabfrage
            const [rows] = await db.query(
                'SELECT user_id, points, level FROM levels WHERE guild_id = ? ORDER BY points DESC LIMIT 10',
                [guildId]
            );

            // Debugging-Ausgabe der Struktur von 'rows'
            console.log('[DEBUG] Abfrageergebnis:', rows);

            // Stelle sicher, dass rows als Array verarbeitet wird
            const leaderboardData = Array.isArray(rows) ? rows : [rows];

            // Überprüfen, ob Daten vorhanden sind
            if (leaderboardData.length === 0 || !leaderboardData[0].user_id) {
                return interaction.reply({
                    content: '❌ Es gibt noch keine Benutzer, die Punkte gesammelt haben.',
                });
            }

            // Erstelle ein Embed für das Leaderboard
            const leaderboardEmbed = new EmbedBuilder()
                .setColor('#FFD700') // Goldene Farbe
                .setTitle(`🏆 Leaderboard für ${interaction.guild.name}`)
                .setDescription('**Die Top 10 Spieler im Server**')
                .setTimestamp();

            // Daten hinzufügen
            leaderboardData.forEach((row, index) => {
                const user = interaction.guild.members.cache.get(row.user_id) || { user: { username: 'Unbekannt' } };
                const rank = index + 1;
                leaderboardEmbed.addFields({
                    name: `#${rank} ${user.user.username}`,
                    value: `Level: ${row.level} | Punkte: ${row.points}`,
                    inline: false,
                });
            });

            return interaction.reply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('❌ Fehler beim Abrufen des Leaderboards:', error);
            interaction.reply({
                content: '❌ Es gab einen Fehler beim Abrufen des Leaderboards. Bitte versuche es später erneut.',
            });
        }
    },
};
