const yargs = require('yargs');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');
const toCelsius = require('fahrenheit-to-celsius');

const argv = yargs
  .options({ // top level options
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
})
.help()
.alias('help', 'h')
.argv;

geocode.geocodeAddress(argv.a, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(results.address);
    weather.getWeather(results.lat, results.lng, (errorMessage, weatherResults) => {
      if (errorMessage) {
        console.log(errorMessage);
      } else {
        var temp = parseFloat(Math.round(toCelsius(weatherResults.temp) * 100) / 100).toFixed(0);

        var aptemp = parseFloat(Math.round(toCelsius(weatherResults.apTemp) * 100) / 100).toFixed(0);

        console.log(`Is's currently: ${temp}˚C, but it feels like: ${aptemp}˚C.`);
      }
    });
  }
});
