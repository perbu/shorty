"use strict";

// Based on a minimal MVC+R
// at https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb


const Url = require('../models/url.model');


exports.url_create =  (req, res, next) => {
    var url = new Url( { key: req.body.key, url: req.body.url } );
    url.save()
    .then( (url) => {  res.send(url); })
    .catch( (err) => {
        if (err.code === 11000) {
            // index violation. key already exists.
            res.status(409);
            res.send("Conflict - key already exists");
        } else {
            // Throw error to middleware.
            next(err);
        }
    });
};


exports.get_url = function (req, res, next) {
    Url.findOne( {'key': req.params.key}, function (err, url) {
        if (err) {
            return next(err); 
        }
        // Not found:
        if ( !url ) {
            return res.status(404).send('Not found.');
        }
        res.redirect(301, url.url); // 301 means permanent redirect.
    })
};

exports.url_update = function (req, res, next) {
    // WTF is $set:
    // mres is mongo response object:
    Url.updateOne({'key': req.params.key }, {$set: req.body}, (err, mres) => {
        if (err) return next(err);
        res.send(mres);
    });
};

exports.url_delete = function (req, res, next) {
    Url.deleteOne({'key': req.params.key}, function (err) {
        if (err) return next(err);
        res.send({'message':'Deleted successfully'});
    })
};