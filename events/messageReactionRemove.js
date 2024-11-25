module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user, db) {
        try {
            console.log(`[DEBUG] Event ausgelöst: Reaktion entfernt - ${reaction.emoji.name} von ${user.tag}.`);

            // Prüfen, ob die Reaktion zu einer Rollenaktion gehört
            const guild = reaction.message.guild;
            if (!guild) return;

            const emojiName = reaction.emoji.name;
            const member = guild.members.cache.get(user.id);

            if (!member) {
                console.warn(`⚠️ [WARN] Mitglied ${user.tag} konnte nicht gefunden werden.`);
                return;
            }

            // Optional: Datenbank prüfen (z.B. ob die Reaktion einer Rolle zugeordnet ist)
            const query = 'SELECT role_id FROM reaction_roles WHERE emoji = ? AND message_id = ?';
            const [rows] = await db.query(query, [emojiName, reaction.message.id]);

            if (rows.length > 0) {
                const roleId = rows[0].role_id;
                const role = guild.roles.cache.get(roleId);

                if (role && member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    console.log(`✅ Rolle "${role.name}" von ${user.tag} entfernt.`);
                } else {
                    console.warn(`⚠️ [WARN] Mitglied ${user.tag} hat die Rolle "${role.name}" nicht.`);
                }
            } else {
                console.warn(`⚠️ [WARN] Keine Rolle für Emoji "${emojiName}" und Nachricht ${reaction.message.id} gefunden.`);
            }
        } catch (error) {
            console.error('❌ [ERROR] Fehler im Event messageReactionRemove:', error.message || error);
        }
    },
};
