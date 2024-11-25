const db = require('../db');

async function addPoints(message, client) {
    const userId = message.author.id;
    const guildId = message.guild.id;

    try {
        // Punkte und Level des Benutzers abrufen oder initialisieren
        const [userRows] = await db.query(
            'SELECT points, level FROM levels WHERE user_id = ? AND guild_id = ?',
            [userId, guildId]
        );

        let points = userRows?.points || 0;
        let level = userRows?.level || 0;

        // Punkte hinzufügen und Level prüfen
        points += 10; // Punkte pro Nachricht
        const [nextLevelRow] = await db.query(
            'SELECT points_required FROM level_settings WHERE guild_id = ?',
            [guildId]
        );

        const pointsRequired = nextLevelRow?.points_required || 100;
        if (points >= level * pointsRequired) {
            level++;

            // Überprüfe, ob es eine Rolle für das erreichte Level gibt
            const [roleRows] = await db.query(
                'SELECT role_id FROM level_roles WHERE guild_id = ? AND required_level = ?',
                [guildId, level]
            );

            if (roleRows.length > 0) {
                const roleId = roleRows[0].role_id;
                const role = message.guild.roles.cache.get(roleId);

                if (role) {
                    const member = message.guild.members.cache.get(userId);
                    if (member) {
                        await member.roles.add(role);
                        message.channel.send(`🎉 Glückwunsch ${message.author}, du hast Level **${level}** erreicht und die Rolle **${role.name}** erhalten!`);
                    }
                }
            }
        }

        // Benutzerinformationen aktualisieren
        await db.query(
            'INSERT INTO levels (user_id, guild_id, points, level) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE points = ?, level = ?',
            [userId, guildId, points, level, points, level]
        );
    } catch (error) {
        console.error('❌ Fehler beim Hinzufügen von Punkten:', error);
    }
}

module.exports = { addPoints };
