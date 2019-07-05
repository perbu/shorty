"use strict";

const express = require('express');
const router = express.Router();

const url_controller = require('../controllers/url.controller');


// a simple test url to check that all of our files are communicating correctly.


router.get('/test', url_controller.test);

router.post('/create', url_controller.url_create);

router.get('/:key', url_controller.get_url );

router.delete('/:key/delete', url_controller.url_delete);

router.put('/:key/update', url_controller.url_update);

// setTimeout( foo => { console.log("bazonk",foo) }, 2000);

module.exports = router;
