const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Fügt eine Reaction Role zu einer Nachricht hinzu.')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('Channel-ID, in dem sich die Nachricht befindet.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('ID der Nachricht, zu der die Reaktion hinzugefügt wird.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji für die Rolle.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Die Rolle, die bei der Reaktion hinzugefügt wird.')
                .setRequired(true)),

    async execute(interaction) {
        const channelId = interaction.options.getString('channel');
        const messageId = interaction.options.getString('messageid');
        let emoji = interaction.options.getString('emoji');
        const role = interaction.options.getRole('role');

        // Extrahiere nur die Emoji-ID, wenn es ein benutzerdefiniertes Emoji ist
        emoji = emoji.match(/\d+/)?.[0] || emoji;

        // Hole den Channel und die Nachricht
        const channel = await interaction.guild.channels.fetch(channelId);
        if (!channel) return interaction.reply({ content: '❌ Channel nicht gefunden.', ephemeral: true });

        const message = await channel.messages.fetch(messageId).catch(() => null);
        if (!message) return interaction.reply({ content: '❌ Nachricht nicht gefunden.', ephemeral: true });

        // Nachricht mit Emoji reagieren lassen
        await message.react(emoji).catch(() => null);

        // Reaction Role in der Datenbank speichern
        const sql = `
            INSERT INTO reaction_roles (guild_id, message_id, emoji, role_id, channel_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(sql, [
            interaction.guild.id,
            messageId,
            emoji,
            role.id,
            channelId,
        ]);

        // Erfolgs-Embed erstellen
        const embed = new EmbedBuilder()
            .setColor(0x00FF00) // Grüner Farbcode für Erfolg
            .setTitle('✅ Reaction Role hinzugefügt!')
            .setDescription(`Die Reaction Role wurde erfolgreich hinzugefügt!`)
            .addFields(
                { name: 'Emoji:', value: `${emoji}`, inline: true },
                { name: 'Rolle:', value: `${role.name}`, inline: true },
                { name: 'Channel:', value: `<#${channelId}>`, inline: true },
                { name: 'Nachricht-ID:', value: `${messageId}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Bot by YourBotName' });

        // Antwort mit Embed
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
