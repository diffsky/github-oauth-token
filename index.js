'use strict';

var request = require('request');
var url = require('url');
var path = require('path');
var crypto = require('crypto');

module.exports = function github(opts) {
  opts.callbackURI = opts.callbackURI || '/github/oauth';
  opts.scope = opts.scope || 'repo';
  opts.githubClient = opts.githubClient || process.env.GITHUB_CLIENT;
  opts.githubSecret = opts.githubSecret || process.env.GITHUB_SECRET;

  var state = crypto.randomBytes(8).toString('hex');
  var urlObj = url.parse(opts.baseURL);
  urlObj.pathname = path.join(urlObj.pathname, opts.callbackURI);
  var redirectURI = url.format(urlObj);

  var authorizeURL = 'https://github.com/login/oauth/authorize'
    + '?client_id=' + opts.githubClient
    + '&scope=' + opts.scope
    + '&redirect_uri=' + redirectURI
    + '&state=' + state;

  return {
    authorizeURL: authorizeURL,
    getAccessToken: function getAccessToken(reqURL, cb){
      try {
        var code = url.parse(reqURL, true).query.code;
        if (!code) {
          return cb('missing oauth code');
        }
        var accessURL = 'https://github.com/login/oauth/access_token'
          + '?client_id=' + opts.githubClient
          + '&client_secret=' + opts.githubSecret
          + '&code=' + code
          + '&state=' + state;

        request.get({url: accessURL, json: true}, function (err, res, body) {
          if (err) {
            return cb(err);
          }
          if (!body.access_token) {
            return cb('no access token returned');
          }
          cb(null, body.access_token);
        });
      } catch (err) {
        cb(err);
      }
    }
  };
};
