const google = require('./lib/google');

module.exports = {

    run: () => {
        return google.deauthorization();
    }

};