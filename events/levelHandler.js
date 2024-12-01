const db = require('../db');

module.exports = {
    name: 'levelHandler',
    async execute(message) {
        if (message.author.bot) return; // Bots werden ignoriert

        const userId = message.author.id;
        const guildId = message.guild.id;

        try {
            // Hole die aktuellen Punkte und das Level des Benutzers
            const [userRow] = await db.query(
                'SELECT points, level FROM levels WHERE user_id = ? AND guild_id = ?',
                [userId, guildId]
            );

            let points = userRow?.points || 0;
            let level = userRow?.level || 1;

            // Prüfen, ob es der erste Punkt des Benutzers ist
            const isFirstPoint = points === 0;

            // Punkte hinzufügen (z. B. 10 Punkte pro Nachricht)
            points += 10;

            // Hole die Punkte für den nächsten Levelaufstieg
            const [settingsRow] = await db.query(
                'SELECT points_to_next_level, level_channel_id FROM level_settings WHERE guild_id = ?',
                [guildId]
            );

            const pointsToNextLevel = settingsRow?.points_to_next_level || 100;
            const levelChannelId = settingsRow?.level_channel_id;

            // Prüfen, ob ein neues Level erreicht wurde
            if (points >= pointsToNextLevel) {
                level++;
                points = 0; // Punkte zurücksetzen

                // Benachrichtigung im Level-Kanal für Levelaufstieg
                if (levelChannelId) {
                    const channel = message.guild.channels.cache.get(levelChannelId);
                    if (channel) {
                        channel.send(`🎉 ${message.author} hat Level ${level} erreicht! Glückwunsch!`);
                    }
                }

                // Überprüfen, ob eine neue Rolle vergeben werden soll
                const [roleRow] = await db.query(
                    'SELECT role_id FROM level_roles WHERE guild_id = ? AND required_level = ?',
                    [guildId, level]
                );

                if (roleRow?.role_id) {
                    const role = message.guild.roles.cache.get(roleRow.role_id);
                    const member = message.guild.members.cache.get(userId);
                    if (role && member) {
                        await member.roles.add(role);
                        message.channel.send(`🎉 ${message.author}, du hast die Rolle **${role.name}** erhalten!`);
                    }
                }
            }

            // Speichere die neuen Punkte und das Level
            await db.query(
                'INSERT INTO levels (user_id, guild_id, points, level) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE points = ?, level = ?',
                [userId, guildId, points, level, points, level]
            );

            // Nachricht bei den ersten Punkten des Benutzers
            if (isFirstPoint && levelChannelId) {
                const channel = message.guild.channels.cache.get(levelChannelId);
                if (channel) {
                    channel.send(`🎉 ${message.author} hat gerade seine ersten Punkte gesammelt! Willkommen im Level-System! 🚀`);
                }
            }

        } catch (error) {
            console.error('❌ Fehler beim Verarbeiten der Level-Logik:', error);
        }
    },
};
