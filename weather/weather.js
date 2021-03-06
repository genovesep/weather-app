const request = require('request')
const toCelsius = require('fahrenheit-to-celsius');

// forecast.io API key
const apiKey = 'cdd8e24dfc1e0435809b0d5f06af96a0';

var getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.darksky.net/forecast/${apiKey}/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    if (body.code === 400) {
      callback(body.error);
    } else if (response.statusCode === 403){
      callback('Problem with API key');
    } else if (!error && response.statusCode === 200){
      var atemp = parseFloat(Math.round(toCelsius(body.currently.temperature) * 100) / 100).toFixed(0);
      var aptemp = parseFloat(Math.round(toCelsius(body.currently.apparentTemperature) * 100) / 100).toFixed(0);
      callback(undefined, {
        temp: atemp,
        apTemp: aptemp
      });
    } else {
      callback('Unable to connect to forecast.io servers.');
    }
  });
};

module.exports = {
  getWeather
};
