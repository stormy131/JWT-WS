const express = require('express');
const router = express.Router();
const routerMain = express.Router();
const {authToken} = require('../mid/logging.js');
const {
    getPage,
    authorize,
    createUser,
    deleteUser,
    addInfo,
    getPageMain,
    refreshToken,
    deleteToken
} = require('../controllers/controllers.js');

router.get('/login', getPage);
router.post('/login', authorize);
router.post('/create', createUser);

router.get('/chat', (req, res) => {
    res.redirect('http://localhost:3001/');
});

routerMain.get('*', authToken, getPageMain);
routerMain.post('/addInfo', addInfo);
routerMain.route('/token')
    .post(refreshToken)
    .delete(deleteToken);
routerMain.route('/').delete(deleteUser);

module.exports = {router, routerMain};