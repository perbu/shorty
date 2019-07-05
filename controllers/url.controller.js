"use strict";

// Based on a minimal MVC+R
// at https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb


const Url = require('../models/url.model');

//Simple version, without validation or sanitation
exports.test = function (req, res,next) {
    res.send( JSON.stringify({'message':'Greetings from the Test controller!'}));
};

exports.url_create = function (req, res, next) {
    console.log("Create URL called:", req.body)
    var url = new Url( { key: req.body.key, url: req.body.url } );
    url.save( (err) => {
        if (err) {
            return next(err); 
        }
        res.send('URL Created successfully')
    })

};

exports.get_url = function (req, res, next) {
    console.log("Get URL called: ",req.params.key);
    Url.findOne( {'key': req.params.key}, function (err, url) {
        if (err) return next(err);
        res.send(url);
    })
};

exports.url_update = function (req, res, next) {
    // WTF is $set:
    Url.updateOne({'key': req.params.key }, {$set: req.body}, function (err, url) {
        if (err) return next(err);
        res.send('URL updated: ', url.key, '=>', url.url);
    });
};

exports.url_delete = function (req, res, next) {
    console.log("Deleting URL: ", req.params.key);

    Url.deleteOne({'key': req.params.key}, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};