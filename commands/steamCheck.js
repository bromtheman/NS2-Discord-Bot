const axios = require('axios').default
require('dotenv').config();
var bigInt = require("big-integer");

const REGEX_STEAMID64 = /^[0-9]{17}$/
const REGEX_STEAMID =  /^STEAM_[0-5]:[01]:\d+$/
const REGEX_STEAMID3 =  /^\[U:1:[0-9]+\]$/

function formatSteamID64ToSteamID(steamId64) {
  let v = bigInt("76561197960265728")
  w = bigInt(steamId64),
  y = w.mod(2).toString()
  w = w.minus(y).minus(v);
  if(w < 1) {
    return false;
  }
  return "STEAM_0:" + y + ":" + w.divide(2).toString();
}

function formatSteamIDToID3(steamId64) {
  if (!steamId64) return
  else if (!REGEX_STEAMID.test(steamId64)) {
    steamId64 = formatSteamID64ToSteamID(steamId64)
  }
  const split = steamId64.split(":");
  console.log("[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]")
  return "[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]";
}

module.exports = {
  name: '!steam',
  description: 'Check the steam id of the user profile',
  async execute(msg, args) {
    const profileLink = args[0]
    if (!profileLink) {
      msg.reply('Please provide a profile url.')
      return
    } 
    try {
      const response = await axios.get('https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/', {
        params: {
          key: process.env.STEAM_KEY,
          vanityUrl: profileLink
        }
      })
      const { steamid } = response.data.response
      formatSteamIDToID3(steamid)
    } catch (error) {
      console.log(error)
    }
  },
};
