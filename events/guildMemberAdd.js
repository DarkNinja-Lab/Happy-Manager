const welcomeMessages = [
    "👋 Willkommen auf unserem Server, {mention}! Schön, dass du da bist! 🎉",
    "Hey {mention}, herzlich willkommen! Wir hoffen, du hast eine tolle Zeit hier. 😊",
    "🎉 {mention} ist beigetreten! Mach es dir bequem und hab Spaß! 🎮",
    "Hallo {mention}! Willkommen in unserer Community! 🚀",
    "🥳 {mention}, herzlich willkommen! Schön, dass du dabei bist!",
];

module.exports = {
    name: 'guildMemberAdd', // Der Eventname
    once: false, // false, weil es bei jedem neuen Mitglied ausgelöst wird
    execute: async (member, db) => {
        const guildId = member.guild.id;

        console.log(`➡️ [DEBUG] Neues Mitglied auf Server ${guildId}: ${member.user.tag}`);

        try {
            // Hole den Willkommenskanal aus der Datenbank
            const result = await db.query(
                'SELECT welcome_channel_id FROM server_config WHERE guild_id = ?',
                [guildId]
            );

            const rows = result[0];
            console.log(`➡️ [DEBUG] Datenbankergebnis für guild_id ${guildId}:`, rows);

            if (!rows || !rows.welcome_channel_id) {
                console.warn(`⚠️ [WARN] Kein Willkommenskanal für Server ${member.guild.name} festgelegt.`);
                return;
            }

            const welcomeChannelId = rows.welcome_channel_id;
            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

            if (!welcomeChannel) {
                console.warn(`⚠️ [WARN] Der gespeicherte Willkommenskanal mit der ID ${welcomeChannelId} existiert nicht.`);
                return;
            }

            // Zufällige Nachricht auswählen und senden
            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            const message = randomMessage.replace('{mention}', `<@${member.user.id}>`);

            await welcomeChannel.send({ content: message });
            console.log(`✅ [INFO] Willkommensnachricht für ${member.user.tag} in Kanal #${welcomeChannel.name} gesendet.`);
        } catch (error) {
            console.error('❌ [ERROR] Fehler beim Senden der Willkommensnachricht:', error);
        }
    },
};
