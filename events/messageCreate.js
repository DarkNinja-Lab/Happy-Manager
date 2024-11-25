const db = require('../db');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const userId = message.author.id;
        const guildId = message.guild.id;

        // Überprüfen, ob die Nachricht vom Disboard-Bot kommt
        if (userId === '302050872383242240') { // Disboard-Bot ID
            console.log('[INFO] Disboard-Bot hat eine Nachricht gesendet. Starte Timer für Erinnerung.');

            try {
                // Hole die Bump-Einstellungen aus der Datenbank
                const [rows] = await db.query(
                    'SELECT role_id, channel_id FROM bump_settings WHERE guild_id = ?',
                    [guildId]
                );

                if (rows.length === 0) {
                    console.warn('[WARN] Keine Bump-Einstellungen gefunden.');
                    return;
                }

                const { role_id, channel_id } = rows[0];
                const reminderTime = 7200000; // 2 Stunden in Millisekunden

                // Starte den Timer für die Bump-Erinnerung
                setTimeout(async () => {
                    const sendBumpReminder = require('../utils/sendBumpReminder');
                    await sendBumpReminder(client, guildId, role_id, channel_id);
                }, reminderTime);
            } catch (error) {
                console.error('❌ Fehler beim Verarbeiten der Disboard-Nachricht:', error);
            }
            return;
        }

        // Level-Up-Logik für andere Nachrichten (keine Bots)
        if (message.author.bot) return;

        try {
            // Hole die aktuellen Punkte und das Level des Benutzers
            const [userRow] = await db.query(
                'SELECT points, level FROM levels WHERE user_id = ? AND guild_id = ?',
                [userId, guildId]
            );

            let points = userRow?.points || 0;
            let level = userRow?.level || 1;

            // Füge Punkte hinzu (z.B. 10 Punkte pro Nachricht)
            points += 10;

            // Hole die Punkte für den nächsten Levelaufstieg
            const [settingsRow] = await db.query(
                'SELECT points_to_next_level FROM level_settings WHERE guild_id = ?',
                [guildId]
            );

            const pointsToNextLevel = settingsRow?.points_to_next_level || 100;

            // Prüfe, ob der Benutzer ein neues Level erreicht hat
            if (points >= pointsToNextLevel) {
                level++;
                points = 0; // Setze die Punkte zurück

                // Hole den Level-Kanal aus der DB
                const [channelRow] = await db.query(
                    'SELECT level_channel_id FROM level_settings WHERE guild_id = ?',
                    [guildId]
                );

                if (channelRow?.level_channel_id) {
                    const channel = message.guild.channels.cache.get(channelRow.level_channel_id);
                    if (channel) {
                        channel.send(`🎉 ${message.author} hat Level ${level} erreicht! Glückwunsch!`);
                    }
                }

                // Überprüfe, ob eine Rolle für das erreichte Level definiert ist
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

            // Speichere die neuen Punkte und das Level in der Datenbank
            await db.query(
                'INSERT INTO levels (user_id, guild_id, points, level) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE points = ?, level = ?',
                [userId, guildId, points, level, points, level]
            );

        } catch (error) {
            console.error('❌ Fehler beim Verarbeiten der Nachricht:', error);
        }
    },
};
