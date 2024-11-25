module.exports = {
    name: 'ready',  // Der Event-Name ist 'ready', weil dieser Event ausgelöst wird, wenn der Bot vollständig eingeloggt ist
    once: true,  // Der Event soll nur einmal ausgeführt werden, also 'true'
    execute: async (client) => {
        console.log(`🎉 [INFO] Bot erfolgreich eingeloggt als ${client.user.tag}`);

        console.log(`🌐 [INFO] Der Bot ist auf ${client.guilds.cache.size} Servern aktiv.`);
        client.guilds.cache.forEach(guild => {
            console.log(`   - ${guild.name} (ID: ${guild.id})`);
        });
    },
};
