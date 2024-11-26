const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const db = require('../db'); // Datenbankabfragen falls nötig

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Spielt Musik von YouTube.')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('Die URL des YouTube-Videos oder der Musik')
                .setRequired(true)),

    async execute(interaction) {
        console.log(`✅ [DEBUG] /play command executed by ${interaction.user.tag}`);

        // Überprüfe, ob der Benutzer in einem Sprachkanal ist
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: '❌ Du musst in einem Sprachkanal sein, um Musik abzuspielen!', ephemeral: true });
        }

        try {
            // Hole die URL aus den Optionen
            const url = interaction.options.getString('url');

            // Überprüfe, ob die URL von YouTube stammt und gültig ist
            if (!ytdl.validateURL(url)) {
                return interaction.reply({ content: '❌ Ungültige YouTube-URL. Stelle sicher, dass die URL korrekt ist.', ephemeral: true });
            }

            // Erstelle einen Audio-Stream von der YouTube-URL
            const stream = ytdl(url, { filter: 'audioonly' });

            // Erstelle eine Audio-Ressource für das Abspielen
            const resource = createAudioResource(stream, {
                inputType: AudioPlayerStatus.Playing,
            });

            // Erstelle einen Audio-Player und verbinde den Bot mit dem Sprachkanal
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Wenn die Verbindung erfolgreich ist, starte den Audio-Player
            const player = createAudioPlayer();

            player.play(resource);
            connection.subscribe(player);

            // Sende eine Bestätigung an den Benutzer
            await interaction.reply({ content: `🎶 Jetzt wird der Song von **${url}** abgespielt!`, ephemeral: true });

            // Handhabung von AudioPlayerStatus
            player.on(AudioPlayerStatus.Playing, () => {
                console.log('Der Song wird jetzt abgespielt.');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('Der Song ist vorbei!');
                connection.destroy(); // Verbindung trennen, wenn der Song endet
            });

        } catch (error) {
            console.error('❌ Fehler beim Abspielen der Musik:', error);
            await interaction.reply({ content: '❌ Es gab einen Fehler beim Abspielen des Songs. Bitte versuche es später erneut.', ephemeral: true });
        }
    },
};
