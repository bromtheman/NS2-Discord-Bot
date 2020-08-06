const axios = require('axios').default
const getSteamID = require('../utils/getSteamID')
const steamFormatters = require('../utils/formatSteamID')
const steamValidation = require('../constants/steamValidation')

const readUserInput = async (args, msg) => {
  if (!args || !args.length) return
  if (args[0].includes('steamcommunity')) {
    // Assume that this is a profile url
    let userId = args[0].substring((args[0].indexOf('/id/')) + 4)
    if (userId[userId.length - 1] === '/') userId = userId.slice(0, -1)
    const steamId = await getSteamID(msg, userId)
    const steamId3 = steamFormatters.formatSteamIDToID3(steamId)
    return steamFormatters.formatSteamID3ToProfileId(steamId3)
  } else {
        // This isn't a profile url. Check if it is a steamId.
        // If not, try to see if it a valid steam id.
    if (steamValidation.REGEX_STEAMID.test(args[0])) {
      const steamId3 = steamFormatters.formatSteamIDToID3(args[0])
      return steamFormatters.formatSteamID3ToProfileId(steamId3)
    }
    else if (steamValidation.REGEX_STEAMID3.test(args[0])) {
      return steamFormatters.formatSteamID3ToProfileId(args[0])
    }
    else if (steamValidation.REGEX_STEAMID64.test(args[0])) {
      // They gave us a valid steam id 64
      const steamId = steamFormatters.formatSteamID64ToSteamID(args[0])
      const steamId3 = steamFormatters.formatSteamIDToID3(steamId)
      return steamFormatters.formatSteamID3ToProfileId(steamId3)
    } else {
      // Assume they gave us a valid steam id
      const steamId = await getSteamID(msg, args[0])
      const steamId3 = steamFormatters.formatSteamIDToID3(steamId)
      return steamFormatters.formatSteamID3ToProfileId(steamId3)
    }
  }

}

module.exports = {
  name: '!hive',
  description: 'Check the hive skill for the passed Steam Id.',
  async execute(msg, args) {
    const steamId = await readUserInput(args, msg)
    if (!steamId) return
    try {
      msg.reply('Fetching your hive score!')
      const response = await axios.get(`http://hive2.ns2cdt.com/api/get/playerData/${steamId}`)
      if (!response.data.skill) throw new Error('Unknown user.')
      msg.reply(`Your hive score: ${response.data.skill}.`)
    } catch (error) {
      console.warn(error)
      msg.reply(`Something went wrong!\nUnable to fetch Hive score.`)
    }
  },
};
