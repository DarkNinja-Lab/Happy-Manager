const disboardReminder = require('../events/disboardReminder');
const levelHandler = require('../events/levelHandler');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        try {
            // Verarbeite die Nachricht vom Disboard-Bot
            if (typeof disboardReminder.execute === 'function') {
                await disboardReminder.execute(message, client);
            } else {
                console.error('❌ disboardReminder.execute ist keine Funktion:', disboardReminder);
            }
        } catch (error) {
            console.error('❌ Fehler bei der Verarbeitung der Disboard-Erinnerung:', error);
        }

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