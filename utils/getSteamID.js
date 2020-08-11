const axios = require('axios').default
require('dotenv').config();

module.exports = async function (msg, userId) {
  console.log(userId)
  try {
    const response = await axios.get('https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/', {
      params: {
        key: process.env.STEAM_KEY,
        vanityUrl: userId
      }
    })
    console.log(response.data)
    const { steamid } = response.data.response
    if (!steamid) throw new Error('No steam id.')
    // formatSteamIDToID3(steamid)
    return steamid
  } catch (error) {
    msg.reply("Error!\nI was unable to find your SteamID.")
    console.log(error)
  }
}
