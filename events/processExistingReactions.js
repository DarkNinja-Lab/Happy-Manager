// events/processExistingReactions.js
module.exports = {
    name: 'ready', // Der Event-Name ist 'ready', weil wir hier auf den Bot-Start warten
    once: true, // Nur einmal ausführen, wenn der Bot bereit ist
    execute: async (client, db) => {
        console.log(`[INFO] Scanne bestehende Reaktionen, um Rollen zuzuweisen...`);

        // Hole alle Einträge aus der Datenbank
        const sql = `SELECT * FROM reaction_roles`;
        const rows = await db.query(sql);

        for (const row of rows) {
            const { guild_id, channel_id, message_id, emoji, role_id } = row;

            // Guild, Channel und Nachricht holen
            const guild = client.guilds.cache.get(guild_id);
            if (!guild) {
                console.warn(`[WARN] Server mit ID ${guild_id} nicht gefunden.`);
                continue;
            }

            const channel = guild.channels.cache.get(channel_id);
            if (!channel) {
                console.warn(`[WARN] Kanal mit ID ${channel_id} nicht gefunden.`);
                continue;
            }

            const message = await channel.messages.fetch(message_id).catch(() => null);
            if (!message) {
                console.warn(`[WARN] Nachricht mit ID ${message_id} nicht gefunden.`);
                continue;
            }

            // Reaktionen durchgehen
            const reaction = message.reactions.cache.get(emoji.replace(/<|>|:/g, ''));
            if (!reaction) {
                console.warn(`[WARN] Reaktion ${emoji} nicht gefunden.`);
                continue;
            }

            // Mitglieder holen, die reagiert haben
            const users = await reaction.users.fetch();
            for (const user of users.values()) {
                if (user.bot) continue;

                const member = await guild.members.fetch(user.id).catch(() => null);
                if (!member) {
                    console.warn(`[WARN] Mitglied mit ID ${user.id} nicht gefunden.`);
                    continue;
                }

                const role = guild.roles.cache.get(role_id);
                if (!role) {
                    console.error(`[ERROR] Rolle mit ID ${role_id} nicht gefunden.`);
                    continue;
                }

                // Überprüfen, ob die Rolle bereits zugewiesen wurde
                if (member.roles.cache.has(role_id)) {
                    console.log(`[INFO] ${member.user.tag} hat bereits die Rolle ${role.name}.`);
                    continue;
                }

                // Rolle zuweisen
                console.log(`[INFO] Weise Rolle ${role.name} an ${member.user.tag} zu.`);
                await member.roles.add(role).catch(console.error);
            }
        }

        console.log(`[INFO] Verarbeiten der bestehenden Reaktionen abgeschlossen.`);
    },
};
