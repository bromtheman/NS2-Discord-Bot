module.exports = {
  name: '!ping',
  description: 'Ping! Useful for a quick health check.',
  execute(msg, args) {
    msg.reply('Pong');
  },
};