const {OAuth2Client, auth}    = require('google-auth-library');
const http              = require('http');
const url               = require('url');
const querystring       = require('querystring');
const opn               = require('opn');
const chalk             = require('chalk');

const Configstore       = require('configstore');
const conf = new Configstore('sheetbase_cli');

const KEYS = {
    clientId: '136996720613-tq98bgs242g5lj3fjs18gg3l5ga9it2u.apps.googleusercontent.com',
    redirectUri: 'http://localhost:3160/oauth2callback',
};

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/script.projects'
];

function getCredentials() {
    return conf.get('google.credentials');
}

module.exports = {

    getCredentials,

    getClient: async () => {
        let client = null;        
        const credentials = getCredentials();
        if(credentials) {
            const oAuth2Client = new OAuth2Client();
            oAuth2Client.setCredentials(credentials);
            client = oAuth2Client;
        }
        return client;
    },

    authorization: () => {
        return new Promise((resolve, reject) => {
            const oAuth2Client = new OAuth2Client(KEYS);    
            oAuth2Client.on('tokens', (tokens) => {
                console.log(chalk.green('Login successfully!'));            
                conf.set('google.credentials', tokens);
            });
        
            const authorizeUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            const server = http.createServer(async (req, res) => {
                if (req.url.indexOf('/oauth2callback') > -1) {
                    const qs = querystring.parse(url.parse(req.url).query);
                    res.end('Authentication successful! You may close this browser tab and return to the console.');
                    server.close();

                    const r = await oAuth2Client.getToken(qs.code)
                    oAuth2Client.setCredentials(r.tokens);
                    resolve(oAuth2Client);
                }
            }).listen(3160, () => {
                opn(authorizeUrl);
            });
        });
    },

    deauthorization: () => {
        return conf.delete('google.credentials');
    }

};