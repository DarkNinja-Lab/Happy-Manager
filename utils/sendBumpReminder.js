module.exports = async (client, guildId, roleId, channelId) => {
    try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.warn(`[WARN] Guild mit ID ${guildId} nicht gefunden.`);
            return;
        }

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            console.warn(`[WARN] Kanal mit ID ${channelId} nicht gefunden.`);
            return;
        }

        const role = guild.roles.cache.get(roleId);
        if (!role) {
            console.warn(`[WARN] Rolle mit ID ${roleId} nicht gefunden.`);
            return;
        }

        await channel.send({
            content: `${role} Zeit, den Server wieder zu bumpen! 🚀`,
        });
        console.log(`[INFO] Bump-Erinnerung im Kanal ${channel.name} gesendet.`);
    } catch (error) {
        console.error('❌ Fehler beim Senden der Bump-Erinnerung:', error);
    }
};
