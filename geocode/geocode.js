const request = require('request');

// API key
const key = 'AIzaSyCzkB2dDm8bmYhJL2T7yhr7qEKZIXeI-Q8';

var geocodeAddress = (address, callback) => {
  var encodedAddress = encodeURIComponent(address)

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${key}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('\nUnable to connect to Google servers.\n');
    } else if (body.status === 'ZERO_RESULTS') {
      callback('\nUnable to find that address\n');
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address,
        lat: body.results[0].geometry.location.lat,
        lng: body.results[0].geometry.location.lng
      });
    }
  });
};

module.exports = {
  geocodeAddress
};
