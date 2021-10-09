const moment = require('moment');

const wrap = (user, text) => {
    return {
        username: user,
        message: text,
        time: moment().format('h:mm a')
    };
};

module.exports = wrap;