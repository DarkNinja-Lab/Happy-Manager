module.exports = {
    name: 'messageCreate',
    once: false,  // Event soll bei jeder neuen Nachricht ausgelöst werden
    execute: async (message) => {
        console.log('MessageCreate Event ausgelöst!');
        
        // Wenn der Bot die Nachricht gesendet hat, ignoriere sie
        if (message.author.bot) return;

        // Debugging: Gebe den Inhalt der Nachricht aus
        console.log(`Nachricht empfangen: ${message.content}`);

        // 1. Reaktion auf traurige Wörter
        const sadWords = ['traurig', 'deprimiert', 'schlecht', 'einsam', 'alleine', 'sad', 'niedergeschlagen', 'unglücklich'];
        for (const word of sadWords) {
            if (message.content.toLowerCase().includes(word)) {
                message.reply("Es tut mir leid, dass du dich so fühlst. Denk daran, dass du nicht alleine bist.💙");
                break; // Antwort nur einmal senden, auch wenn mehrere traurige Wörter vorkommen
            }
        }

        // 2. Reaktion auf lustlose Wörter
        const lazyWords = ['langweilig', 'lustlos', 'müde', 'unmotiviert'];
        for (const word of lazyWords) {
            if (message.content.toLowerCase().includes(word)) {
                message.reply("Hey, das klingt nicht gut. Vielleicht hilft es, eine kleine Pause zu machen oder etwas Neues auszuprobieren! 😊");
                break;
            }
        }

        // 3. Reaktion auf Aktionen (Feierabend, Geburtstag usw.)
        if (message.content.toLowerCase().includes('feierabend')) {
            message.reply("Feierabend! 🎉 Jetzt kannst du dich entspannen und deinen Tag genießen. 🍹");
        }

        if (message.content.toLowerCase().includes('geburtstag')) {
            message.reply("Alles Gute zum Geburtstag! 🎂🎉 Ich hoffe, dein Tag ist voller Freude und Spaß!");
        }

        // 4. Reaktion auf Essen, Hunger und Kochen
        if (message.content.toLowerCase().includes('essen')) {
            message.reply("Oh, Essen! 🍽️ Was gibt's denn Leckeres? Hast du etwas Geiles gekocht?");
        }

        if (message.content.toLowerCase().includes('hunger')) {
            message.reply("Hunger, oh je! 😅 Was möchtest du essen? Vielleicht ein schnelles Sandwich oder ein warmes Gericht?");
        }

        if (message.content.toLowerCase().includes('kochen')) {
            message.reply("Kochen ist immer eine gute Idee! 🍳 Was hast du vor zu kochen? Vielleicht ein neues Rezept?");
        }

        // 5. Reaktion auf „Jemand da?“
        if (message.content.toLowerCase().includes('jemand da')) {
            message.reply("Ja, ich bin da! 😊 Was kann ich für dich tun?");
        }

        // 6. Reaktion auf „Verzweiflung“ und ähnliche Worte
        const despairWords = ['verzweifeln', 'hoffnungslos', 'verzweiflung', 'aufgeben'];
        for (const word of despairWords) {
            if (message.content.toLowerCase().includes(word)) {
                message.reply("Es tut mir leid, dass du dich so fühlst. Es gibt immer einen Weg, auch wenn es gerade schwer aussieht. Du bist nicht alleine. ❤️");
                break;
            }
        }

        // 7. Reaktionen auf allgemeine Fragen oder Aussagen
        // Frage: "Wie geht es dir?"
        if (message.content.toLowerCase() === 'wie geht es dir?') {
            message.reply("Mir geht's super, danke der Nachfrage! Und dir? 😊");
        }

        // 8. Humorvolle Reaktion auf Fragen wie "ping"
        if (message.content.toLowerCase() === 'ping') {
            message.reply("Pong! 🏓 Ich bin schneller als der Schall!");
        }

        // 9. Zufällige Fragen und humorvolle Interaktionen
        if (message.content.toLowerCase().includes("was geht")) {
            message.reply("Nicht viel, aber ich bin hier, um zu helfen! 😄 Was geht bei dir?");
        }

        if (message.content.toLowerCase().includes("was macht ihr so")) {
            message.reply("Ich bin hier, um dir zu helfen!😎");
        }

        // 10. Zusätzliche Hilfe bei anderen Themen
        if (message.content.toLowerCase().includes('hilfe')) {
            message.reply("Ich bin hier, um dir zu helfen! Was kann ich für dich tun? 😊");
        }

        if (message.content.toLowerCase().includes('ich fühle mich schlecht')) {
            message.reply("Es ist okay, sich mal schlecht zu fühlen. Du wirst wieder auf die Beine kommen. Ich glaube an dich! 🌟");
        }
    },
};
