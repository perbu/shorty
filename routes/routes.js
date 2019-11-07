"use strict";

const express = require('express');
const router = express.Router();

const url_controller = require('../controllers/url.controller');
const user_controller = require('../controllers/user.controller');

//router.post('/login', () => { console.log("login route")} );

router.post('/create', url_controller.url_create);
router.get('/:key', url_controller.get_url );
router.delete('/:key/delete', url_controller.url_delete);
router.put('/:key/update', url_controller.url_update);

// Here is the bork.
router.post('/login', user_controller.login );

module.exports = router;
