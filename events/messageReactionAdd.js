const db = require('../db');

module.exports = {
    name: 'messageReactionAdd', // Name des Events
    async execute(reaction, user) {
        console.log(`[DEBUG] Event ausgelöst: ${reaction.emoji.name} von ${user.tag}`);
        if (user.bot) return;

        const emojiId = reaction.emoji.id || reaction.emoji.name;
        const messageId = reaction.message.id;

        // Datenbank-Abfrage
        const sql = `SELECT * FROM reaction_roles WHERE message_id = ? AND emoji = ?`;
        const rows = await db.query(sql, [messageId, emojiId]);

        if (rows.length === 0) {
            console.log(`[INFO] Keine zugeordnete Rolle für Nachricht ${messageId} mit Emoji ${emojiId} gefunden.`);
            return;
        }

        const roleId = rows[0].role_id;
        const role = reaction.message.guild.roles.cache.get(roleId);
        if (!role) {
            console.error(`[ERROR] Rolle mit ID ${roleId} nicht gefunden.`);
            return;
        }

        const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
            console.error(`[ERROR] Mitglied mit ID ${user.id} nicht gefunden.`);
            return;
        }

        console.log(`[DEBUG] Rolle wird hinzugefügt: ${role.name} für ${member.user.tag}`);
        await member.roles.add(role).catch(console.error);
    },
};
