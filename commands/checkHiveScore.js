const axios = require('axios').default




module.exports = {
  name: '!hive',
  description: 'Check the hive skill for the passed Steam Id.',
  async execute(msg, args) {
    const steamId = args[0]
    if (!steamId) msg.reply('Please provide a steamId.')
    try {
      msg.reply('Fetching your hive score!')
      const response = await axios.get(`http://hive2.ns2cdt.com/api/get/playerData/${steamId}`)
      if (!response.data.skill) throw new Error('Unknown user.')
      msg.reply(`Your hive score: ${response.data.skill}.`)
    } catch (error) {
      console.warn(error)
      msg.reply(`Something went wrong!\nUnable to fetch Hive score for SteamId: ${steamId}.`)
    }
  },
};
