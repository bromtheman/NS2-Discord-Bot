const axios = require('axios').default
const getSteamID = require('../utils/getSteamID')
const steamFormatters = require('../utils/formatSteamID')
const TimeHelpers = require('../utils/timeHelpers')
const steamValidation = require('../constants/steamValidation')

const validateInputAgainstSteamIds = async (input, msg) => {
  if (steamValidation.REGEX_STEAMID.test(input)) {
    // They gave us a valid steam id
    const steamId3 = steamFormatters.formatSteamIDToID3(input)
    return steamFormatters.formatSteamID3ToProfileId(steamId3)
  }
  else if (steamValidation.REGEX_STEAMID3.test(input)) {
    // They gave us a valid steam id 3  
    return steamFormatters.formatSteamID3ToProfileId(input)
  }
  else if (steamValidation.REGEX_STEAMID64.test(input)) {
    // They gave us a valid steam id 64
    const steamId = steamFormatters.formatSteamID64ToSteamID(input)
    const steamId3 = steamFormatters.formatSteamIDToID3(steamId)
    return steamFormatters.formatSteamID3ToProfileId(steamId3)
  } else {
    // Assume they gave us a valid vanity steam name
    const steamId = await getSteamID(msg, input)
    const steamId3 = steamFormatters.formatSteamIDToID3(steamId)
    return steamFormatters.formatSteamID3ToProfileId(steamId3)
  }
} 

const readUserInput = async (args, msg) => {
  if (!args || !args.length) return
  if (args[0].includes('profiles')) {
    // The user hasn't set up a profile url.
    let userId = args[0].substring((args[0].indexOf('/profiles/')) + 10)
    if (userId[userId.length - 1] === '/') userId = userId.slice(0, -1)
    return await validateInputAgainstSteamIds(userId, msg)
  }
  else if (args[0].includes('/id/')) {
    // Assume that this is a profile url
    let userId = args[0].substring((args[0].indexOf('/id/')) + 4)
    if (userId[userId.length - 1] === '/') userId = userId.slice(0, -1)
    const steamId = await getSteamID(msg, userId)
    const steamId3 = steamFormatters.formatSteamIDToID3(steamId)
    return steamFormatters.formatSteamID3ToProfileId(steamId3)
  } else {
    // This isn't a profile url. Check if it is a steamId.
    // If not, try to see if it a valid steam id.
    return await validateInputAgainstSteamIds(args[0], msg)
  }
}

const beautifyInput = (args) => {
  if (args[0].includes('/id/')) {
    let userId = args[0].substring((args[0].indexOf('/id/')) + 4)
    if (userId[userId.length - 1] === '/') userId = userId.slice(0, -1)
    return userId
  } else return args[0]
}

const beautifyOutput = (data) => {
  return "```" + `${data.alias}:\n
  Skill: ${data.skill}
  Marine Playtime: ${TimeHelpers.secondToHms(data.marine_playtime)}
  Alien Playtime: ${TimeHelpers.secondToHms(data.alien_playtime)}
  Commander Playtime: ${TimeHelpers.secondToHms(data.commander_time)}` + "```"
}

module.exports = {
  name: '!hive',
  description: 'Check the hive skill for the passed Steam Id.',
  async execute(msg, args) {
    const steamId = await readUserInput(args, msg)
    if (!steamId) return
    try {
      msg.reply(`Fetching the hive skill for ${beautifyInput(args)}`)
      const response = await axios.get(`http://hive2.ns2cdt.com/api/get/playerData/${steamId}`)
      if (!response.data.skill) throw new Error('Unknown user.')
      msg.reply(beautifyOutput(response.data))
    } catch (error) {
      console.warn(error)
      msg.reply(`Something went wrong!\nUnable to fetch Hive score.`)
    }
  },
};
