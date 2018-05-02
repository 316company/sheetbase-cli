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
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/script.projects'
];

function getCredentials() {
    return conf.get('google.credentials');
}

async function getClient (){
    let client = null;
    const credentials = getCredentials();
    if(credentials) {
        client = new OAuth2Client(KEYS);
        client.setCredentials(credentials);
        await client.refreshAccessToken();
    }
    return client;
}

module.exports = {

    getCredentials,

    getClient: getClient,

    verify: async () => {
        let user = null;
        const client = await getClient();
        if(client) {
            try {
                const userData = await client.verifyIdToken({
                    idToken: client.credentials.id_token,
                    audience: KEYS.clientId
                });
                const payload = userData.getPayload();
                user = {
                    userId: payload['sub'],
                    email: payload['email'],
                    accessToken: client.credentials.access_token
                };
            } catch(error) {}
        }
        return user;
    },

    authorization: () => {
        return new Promise((resolve, reject) => {
            const oAuth2Client = new OAuth2Client(KEYS);    
            oAuth2Client.on('tokens', (tokens) => {
                if (tokens.refresh_token) {
                    conf.set('google.credentials', {
                        refresh_token: tokens.refresh_token
                    });
                }    
                console.log(chalk.green('Login successfully!'));        
            });
        
            const authorizeUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            const server = http.createServer(async (req, res) => {
                if (req.url.indexOf('/oauth2callback') > -1) {
                    const qs = querystring.parse(url.parse(req.url).query);
                    if(qs.error) {
                        res.end('Authentication fails, please try again!');
                    } else {
                        res.end('Authentication successful! You may close this browser tab and return to the console.');
                    }
                    server.close();

                    if(qs.code) {
                        const r = await oAuth2Client.getToken(qs.code)
                        oAuth2Client.setCredentials(r.tokens);
                        resolve(oAuth2Client);
                    } else {
                        reject();
                    }
                }
            }).listen(3160, () => {
                opn(authorizeUrl, {wait: false});
            });
        });
    },

    deauthorization: () => {
        return conf.delete('google.credentials');
    }

};