const levelHandler = require('../events/levelHandler');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        try {
            // Verarbeite die Nachricht für Level-Logik
            if (typeof levelHandler.execute === 'function') {
                await levelHandler.execute(message, client);
            } else {
                console.error('❌ levelHandler.execute ist keine Funktion:', levelHandler);
            }
        } catch (error) {
            console.error('❌ Fehler bei der Verarbeitung der Level-Logik:', error);
        }
    },
};