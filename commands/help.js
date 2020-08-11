module.exports = {
  name: '!help',
  description: 'Get a list of commands and their description.',
  execute(msg, args) {
    const commandInfo = Object.keys(args).map(
      (command) => `${args[command].name} - ${args[command].description}`
    ).join('\n')
    msg.channel.send("```" + commandInfo + "```")
  },
};