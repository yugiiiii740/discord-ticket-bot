const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Komut çalıştırılırken bir hata oluştu.", ephemeral: true });
      }
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "ticket_reason") {
      const category = {
        satinalim: "🛒-satinalim",
        bug_sikayet: "🐞-bug-sikayet",
        diger: "📌-diger"
      };

      const reason = interaction.values[0];
      const channelName = `${interaction.user.username.toLowerCase()}-${reason}`;
      const existing = interaction.guild.channels.cache.find(c => c.name === channelName);

      if (existing) {
        await interaction.reply({ content: "Zaten açık bir ticket'in var.", ephemeral: true });
        return;
      }

      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
        ]
      });

      await channel.send(`🎫 **Destek Talebi**\nKonu: ${reason}\nKullanıcı: <@${interaction.user.id}>`);
      await interaction.reply({ content: `✅ Ticket'in açıldı: ${channel}`, ephemeral: true });
    }
  }
};
