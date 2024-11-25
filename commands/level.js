const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Zeigt dein Level und deine Punkte an.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        try {
            // Hole das Level und die Punkte des Benutzers aus der DB
            const [userRow] = await db.query(
                'SELECT points, level FROM levels WHERE user_id = ? AND guild_id = ?',
                [userId, guildId]
            );

            if (!userRow) {
                return interaction.reply({
                    content: '❌ Du hast noch kein Level. Sende einfach Nachrichten, um Punkte zu sammeln! 🚀'
                });
            }

            const { points, level } = userRow;

            // Hole die Punkte für das nächste Level
            const [settingsRow] = await db.query(
                'SELECT points_to_next_level FROM level_settings WHERE guild_id = ?',
                [guildId]
            );

            const pointsToNextLevel = settingsRow ? settingsRow.points_to_next_level : 100;
            const progress = Math.min((points / pointsToNextLevel) * 100, 100); // Berechne den Fortschritt als Prozentwert

            // Erstelle ein Embed mit schönerer Formatierung
            const levelEmbed = new EmbedBuilder()
                .setColor('#FFD700') // Goldene Farbe für das Level-System
                .setTitle(`Level Info für ${interaction.user.username}`)
                .setDescription(`**Du bist auf Level ${level}!** 🎉\n\nDu hast **${points}** Punkte gesammelt.`)
                .addFields(
                    { name: 'Punkte bis zum nächsten Level:', value: `${pointsToNextLevel - points} Punkte` },
                    { name: 'Nächstes Level:', value: `Level ${level + 1}` }
                )
                .setThumbnail(interaction.user.avatarURL()) // Profilbild des Nutzers als Thumbnail
                .setFooter({ text: 'Sammle mehr Punkte, um aufzusteigen!' })
                .setTimestamp();

            // Füge einen Fortschrittsbalken hinzu (Textbasiert)
            const progressBar = '▓'.repeat(Math.floor(progress / 10)) + '▒'.repeat(10 - Math.floor(progress / 10));
            levelEmbed.addFields({
                name: 'Fortschritt zum nächsten Level:',
                value: `${progressBar} ${Math.floor(progress)}%`,
            });

            return interaction.reply({ embeds: [levelEmbed] });

        } catch (error) {
            console.error('❌ Fehler beim Abrufen des Levels:', error);
            interaction.reply({
                content: '❌ Es gab einen Fehler beim Abrufen deines Levels. Bitte versuche es später erneut.'
            });
        }
    },
};
