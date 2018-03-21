'use strict'

const mongoose = require('mongoose');
const moment   = require('moment');

const projectSchema = mongoose.Schema({
	createdAt    : { type: String, default: new Date() },
	user         : { type: String, ref: 'User'},
	name         : String,
	description  : String,
	repoUrl      : String,
	demoUrl      : String  
});


module.exports = mongoose.model('Project', projectSchema);
