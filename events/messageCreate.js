const levelHandler = require('../events/levelHandler');
const db = require('../db'); // Verbindung zur MariaDB

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        console.log(`➡️ [DEBUG] Nachricht erhalten: "${message.content}" von ${message.author.tag}`);

        try {
            try {
                console.log('➡️ [DEBUG] Level-Logik: Verarbeitung der Nachricht...');
                if (typeof levelHandler.execute === 'function') {
                    await levelHandler.execute(message, client);
                } else {
                    console.error('❌ levelHandler.execute ist keine Funktion:', levelHandler);
                }
            } catch (error) {
                console.error('❌ Fehler bei der Verarbeitung der Level-Logik:', error);
            }
        } catch (error) {
            console.error('❌ Allgemeiner Fehler bei messageCreate:', error);
        }
    },
};
