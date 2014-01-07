# Github oauth token

Generate a github oauth token.

## Usage

Example usage in an express app

```
// require and configure the gihub oauth generator
var github = require('github-oauth-token')({
  githubClient: '', // or process.env['GITHUB_CLIENT'],
  githubSecret: '', // or process.env['GITHUB_SECRET'],
  baseURL: 'http://example.com',
  callbackURI: '/github/oauth',
  scope: 'repo' // default 'repo'
});

app.get('/github/login', function(req, res){
  // get the oauth authorization URL and redirect the user to it
  res.redirect(github.authorizeURL);
});

app.get('/github/oauth', function(req, res){
  // pass the request url to the `getAccessToken` function which will
  // return the token, via a callback, on success
  github.getAccessToken(req.url, function(err, token){
    if(err){
      return res.end(err);
    }
    if(token){
      res.send(token);
    } else {
      res.send('no token');
    }
  });
});
```
