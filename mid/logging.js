const jwt = require('jsonwebtoken');

const logger = (req, res, next) => {
    const date = new Date();
    const method = req.method;
    const url = req.url;
    const body = req.body ? req.body : '';

    console.log(date, method, url, body);
    next();
};

const authToken = (req, res, next) => {
    const token = req.headers.usertoken;
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) console.log(err);
        
        req.auth = err ? false : true;
        req.user = user;
        res.userToken = token;
    });

    next();
};

module.exports = {logger, authToken};
