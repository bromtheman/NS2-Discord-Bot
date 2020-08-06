
const steamValidation = require('../constants/steamValidation')
var bigInt = require("big-integer");

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
  else if (!steamValidation.REGEX_STEAMID.test(steamId64)) {
    steamId64 = formatSteamID64ToSteamID(steamId64)
  }
  const split = steamId64.split(":");
  console.log("[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]")
  return "[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]";
}

function formatSteamID3ToProfileId(steamID3) {
  if (!steamID3) return
  return steamID3.split(':')[2]
}



module.exports = {
  formatSteamIDToID3,
  formatSteamID64ToSteamID,
  formatSteamID3ToProfileId
}