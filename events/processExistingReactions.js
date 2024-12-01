module.exports = {
    name: 'ready', // Der Event-Name ist 'ready', weil wir hier auf den Bot-Start warten
    once: true, // Nur einmal ausführen, wenn der Bot bereit ist
    execute: async (client, db) => {
        console.log(`[INFO] Scanne bestehende Reaktionen, um Rollen zuzuweisen...`);

        try {
            // Hole alle Einträge aus der Datenbank
            const sql = `SELECT * FROM reaction_roles`;
            const rows = await db.query(sql);

            if (rows.length === 0) {
                console.log(`[INFO] Keine Reaktionen in der Datenbank gefunden.`);
                return;
            }

            for (const row of rows) {
                const { guild_id, channel_id, message_id, emoji, role_id } = row;

                // Hole die Guild
                const guild = client.guilds.cache.get(guild_id);
                if (!guild) {
                    console.warn(`[WARN] Server mit ID ${guild_id} nicht gefunden.`);
                    continue;
                }

                // Hole den Kanal
                const channel = guild.channels.cache.get(channel_id);
                if (!channel) {
                    console.warn(`[WARN] Kanal mit ID ${channel_id} nicht gefunden.`);
                    continue;
                }

                // Hole die Nachricht
                const message = await channel.messages.fetch(message_id).catch(() => null);
                if (!message) {
                    console.warn(`[WARN] Nachricht mit ID ${message_id} nicht gefunden.`);
                    continue;
                }

                // Bereinige das Emoji, um sicherzustellen, dass es mit dem Datenbankformat übereinstimmt
                const formattedEmoji = emoji.includes(':') ? emoji.split(':')[1] : emoji; // Bereinigt `<:emojiName:id>` auf `emojiName`
                const reaction = message.reactions.cache.get(formattedEmoji);
                if (!reaction) {
                    console.warn(`[WARN] Reaktion "${emoji}" nicht gefunden.`);
                    continue;
                }

                // Hole Benutzer, die auf die Nachricht reagiert haben
                const users = await reaction.users.fetch();
                for (const user of users.values()) {
                    if (user.bot) continue; // Überspringe Bots

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

                    // Überprüfe, ob die Rolle bereits zugewiesen ist
                    if (member.roles.cache.has(role_id)) {
                        console.log(`[INFO] ${member.user.tag} hat bereits die Rolle ${role.name}.`);
                        continue;
                    }

                    // Weise die Rolle zu
                    console.log(`[INFO] Weise Rolle ${role.name} an ${member.user.tag} zu.`);
                    await member.roles.add(role).catch(err => {
                        console.error(`[ERROR] Fehler beim Zuweisen der Rolle ${role.name} an ${member.user.tag}:`, err);
                    });
                }
            }

            console.log(`[INFO] Verarbeiten der bestehenden Reaktionen abgeschlossen.`);
        } catch (error) {
            console.error(`[ERROR] Fehler beim Verarbeiten der bestehenden Reaktionen:`, error.message || error);
        }
    },
};
