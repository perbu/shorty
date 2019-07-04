"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/*
 * URL Schema
 */

const UrlSchema = new Schema({
  key: {
    type: String,
    index: true,
    unique: true
  },
  url: {
    type: String
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UrlSchema.method({});

/**
 * Statics
 */

UrlSchema.static({});

/**
 * Register
 */

module.exports = mongoose.model("Url", UrlSchema);
