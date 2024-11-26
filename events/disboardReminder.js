const db = require('../db');
const sendBumpReminder = require('../utils/sendBumpReminder');

module.exports = {
    name: 'disboardReminder',
    async execute(message, client) {
        const userId = message.author.id;
        const guildId = message.guild.id;

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
                    try {
                        await sendBumpReminder(client, guildId, role_id, channel_id);
                    } catch (error) {
                        console.error('❌ Fehler beim Senden der Bump-Erinnerung:', error);
                    }
                }, reminderTime);

            } catch (error) {
                console.error('❌ Fehler beim Verarbeiten der Disboard-Nachricht:', error);
            }
        }
    },
};
