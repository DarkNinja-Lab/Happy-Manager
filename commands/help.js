const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hilfe')
        .setDescription('📋 Zeigt eine Liste aller verfügbaren Befehle.'),

    async execute(interaction) {
        console.log(`✅ [DEBUG] /hilfe command executed by ${interaction.user.tag}`);

        // Erstellung des Embed-Builders für die Hilfe
        const embed = new EmbedBuilder()
            .setTitle('📜 Hilfe & Befehle')
            .setDescription(
                'Hier findest du alle verfügbaren Befehle für den Bot.\n\n' +
                '📢 **Hinweis:** Für Fragen oder Probleme wende dich bitte an **@Admin** oder **@Management**.'
            )
            .setColor('Purple')
            .setTimestamp()
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            });

        // Allgemeine Befehle hinzufügen
        embed.addFields(
            {
                name: '📋 **Allgemeine Befehle**',
                value:
                    '🎖️ **/level** - Zeigt dein Level und deine Punkte an.\n' +
                    '🏆 **/leaderboard** - Zeigt die Bestenliste der Benutzer.',
            },
            {
                name: '🎵 **Musik Befehle**',
                value:
                    '🎶 **/play <Titel/URL>** - Spielt einen Song ab.\n' +
                    '⏸️ **/pause** - Pausiert die Wiedergabe.\n' +
                    '⏭️ **/skip** - Überspringt den aktuellen Song.',
            }
        );

        console.log(`📤 [DEBUG] Sending help embed to ${interaction.user.tag}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
