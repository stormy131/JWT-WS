require('dotenv').config();

const express = require('express');
const app = express();
const {logger} = require('./mid/logging.js');
const {router, routerMain} = require('./routers/routes.js');
const path = require('path');
const server = require('./chatServer/server.js');

app.use(express.static(path.resolve(__dirname, './static/')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(logger);
app.use(router);
app.use('/main', routerMain);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

server.listen(process.env.CHAT_PORT, () => {
    console.log(`Chat server is running on port ${process.env.CHAT_PORT}`);
});