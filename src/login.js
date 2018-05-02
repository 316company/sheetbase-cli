const google = require('./lib/google');

module.exports = {

    run: async () => {
        const client = await google.getClient();
        if(client)
            return console.log('Already login!');
        
        await google.authorization();
        process.exit();
    }

};