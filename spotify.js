'use strict'

var SpotifyWebApi = require('spotify-web-api-node');

var scopes = ['user-read-private', 'user-read-email'];
var redirectUri = 'https://the-app-ride.herokuapp.com/spotify-success';
var clientId = process.env.SPOTIFY_CLIENT_ID;
var state = '1996m15wed';

var spotifyApi = new SpotifyWebApi({
  redirectUri: `${redirectUri}`,
  clientId: process.env.SPOTIFY_CLIENT_ID
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);


// var code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';

// spotifyApi.authorizationCodeGrant(code)
// .then(function(data) {
//   console.log('The token expires in ' + data.body['expires_in']);
//   console.log('The access token is ' + data.body['access_token']);
//   console.log('The refresh token is ' + data.body['refresh_token']);

//   // Set the access token on the API object to use it in later calls
//   spotifyApi.setAccessToken(data.body['access_token']);
//   spotifyApi.setRefreshToken(data.body['refresh_token']);
// }, function(err) {
//   console.log('Something went wrong!', err);
// });

module.exports = {
  spotifyApi,
  authorizeURL
}