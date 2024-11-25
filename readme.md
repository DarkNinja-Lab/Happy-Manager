# 🎉 Discord Bot

Ein vielseitiger **Discord Bot**, der verschiedene Funktionen bietet, um deinen Server lebendig und interaktiv zu halten. Von **Willkommensnachrichten** bis hin zu **Reaktionsrollen** und **emotionaler Unterstützung** – dieser Bot sorgt dafür, dass deine Community sich willkommen und engagiert fühlt.

---

## 🚀 Features

- **Willkommensnachrichten**: Sende eine zufällige Nachricht, wenn ein neues Mitglied beitritt.
- **Reaktionsrollen**: Vergib Rollen basierend auf Reaktionen auf bestimmte Nachrichten.
- **Emotionale Unterstützung**: Reagiere auf traurige, lustlose oder motivierende Nachrichten.
- **Feierliche Antworten**: Feiere besondere Momente wie Geburtstagswünsche und Feierabend.
- **Interaktive Antworten**: Lustige und hilfsbereite Antworten auf allgemeine Fragen.

---

## 🛠️ Installation

### Voraussetzungen

- Node.js (>= 16.x)
- Eine Discord-Bot-Token
- Eine MySQL-Datenbank (oder eine kompatible SQL-Datenbank)

### Schritte zur Installation

1. **Repository klonen:** ```git clone https://github.com/DarkNinja-Lab/Happy-Manager.git```

2. **Ins Verzeichniss** ```cd Happy-Manager```



### Abhängigkeiten installieren:

```npm install```

Umgebungsvariablen einrichten: Erstelle eine .env-Datei im Projektordner und füge dein Bot-Token sowie andere Konfigurationen hinzu:


```DISCORD_TOKEN=dein-bot-token
DB_HOST=localhost
DB_USER=dein-benutzername
DB_PASSWORD=dein-passwort
DB_NAME=deine-datenbank
```
Bot starten:

```npm start```

### ⚙️ Konfiguration

**Willkommensnachrichten:** Du kannst die Willkommensnachrichten in der ```guildMemberAdd.js``` anpassen.
**Reaktionsrollen:** Stelle sicher, dass du die Reaktionsrollen in der ```Datenbank``` konfigurierst. Die Konfiguration erfolgt über den Befehl !reactionrole.

🤖 Befehle

- ```!reactionrole:``` Erstellt eine Nachricht, auf die Benutzer mit Emojis reagieren können, um eine Rolle zu erhalten.
- ```!setWelcomeChannel:``` Setze den Kanal, in dem neue Mitglieder begrüßt werden.


### 🛠️ Unterstützte Events

- guildMemberAdd: Begrüßt neue Mitglieder im Server.
- messageCreate: Reagiert auf Nachrichten mit vordefinierten Antworten.
- messageReactionAdd: Weist Rollen basierend auf Emoji-Reaktionen zu.
- messageReactionRemove: Entfernt Rollen, wenn Reaktionen entfernt werden.
- ready: Der Bot ist bereit und läuft.
- processExistingReactions: Verarbeitet bestehende Reaktionen beim Start des Bots.


### 💡 Weiterführende Links

- [Discord Developers](https://discord.com/developers/applications)
- [Node.js](https://nodejs.org)
- [MySQL](https://www.mysql.com/de/)
