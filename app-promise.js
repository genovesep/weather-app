const yargs = require('yargs');
const axios = require('axios');
const toCelsius = require('fahrenheit-to-celsius');

// google API key
const googleApiKey = 'AIzaSyCzkB2dDm8bmYhJL2T7yhr7qEKZIXeI-Q8';

// forecast.io API key
const weatherApiKey = 'cdd8e24dfc1e0435809b0d5f06af96a0';

const argv = yargs
  .options({ // top level options
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      default: '06410250',
      string: true
    }
})
.help()
.alias('help', 'h')
.argv;

var encodedAddress = encodeURIComponent(argv.a);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`

axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') throw new Error('Unable to find that Address.');

  console.log(response.data);
  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.darksky.net/forecast/${weatherApiKey}/${lat},${lng}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
}).then((response) => {
  var temperature = parseFloat(Math.round(toCelsius(response.data.currently.temperature) * 100) / 100).toFixed(0);
  var apparentTemperature = parseFloat(Math.round(toCelsius(response.data.currently.apparentTemperature) * 100) / 100).toFixed(0);
  console.log(`The current temperature is ${temperature}, but it feels like ${apparentTemperature}`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers.');
  } else {
    console.log(e.message);
  }
});
