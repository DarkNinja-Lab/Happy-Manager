const db = require('../db'); // Importiere die Datenbankverbindung

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) { 
        try {
            console.log(`[DEBUG] Event ausgelöst: Reaktion entfernt - ${reaction.emoji.name} von ${user.tag}.`);

            // Prüfen, ob die Reaktion zu einer Rollenaktion gehört
            const guild = reaction.message.guild;
            if (!guild) return;

            // Für benutzerdefinierte Emojis die ID verwenden, sonst den Namen
            const emojiIdentifier = reaction.emoji.id || reaction.emoji.name;
            console.log(`[DEBUG] Emoji-Identifier: ${emojiIdentifier}`);

            const member = guild.members.cache.get(user.id);
            if (!member) {
                console.warn(`⚠️ [WARN] Mitglied ${user.tag} konnte nicht gefunden werden.`);
                return;
            }

            // Datenbank prüfen
            const query = 'SELECT role_id FROM reaction_roles WHERE emoji = ? AND message_id = ?';
            const rows = await db.query(query, [emojiIdentifier, reaction.message.id]);

            console.log(`[DEBUG] SQL-Ergebnisse:`, rows);

            if (rows.length > 0) {
                const roleId = rows[0].role_id;
                const role = guild.roles.cache.get(roleId);

                if (role && member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    console.log(`✅ Rolle "${role.name}" von ${user.tag} entfernt.`);
                } else if (!role) {
                    console.error(`[ERROR] Rolle mit ID ${roleId} nicht gefunden.`);
                } else {
                    console.warn(`⚠️ [WARN] Mitglied ${user.tag} hat die Rolle "${role.name}" nicht.`);
                }
            } else {
                console.warn(`⚠️ [WARN] Keine Rolle für Emoji "${emojiIdentifier}" und Nachricht ${reaction.message.id} gefunden.`);
            }
        } catch (error) {
            console.error('❌ [ERROR] Fehler im Event messageReactionRemove:', error.message || error);
        }
    },
};
