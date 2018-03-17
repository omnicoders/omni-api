'use strict'

const mongoose = require('mongoose');
const moment   = require('moment');
const bcrypt   = require('bcrypt');

const userSchema = mongoose.Schema({
	createdAt : { type: String, default: new Date() },
	isAdmin   : { type: Boolean, default: false },
	username  : { type: String, index: { unique: true }},
	password  : String,
	name: String,
	email: String,
	imageUrl: String,
	gameLevel: { type: Number, default: 1 },
	isVisible: { type: Boolean, default: false },
	status: { type: String, default: "resting" },
	level  : { type: Number, default: 1 },
	health        : { type: Number, default: 50 },
	healthMax     : { type: Number, default: 50 },
	energy        : { type: Number, default: 10 },
	energyMax     : { type: Number, default: 10 },
	experience    : { type: Number, default: 0 },
	experienceMax : { type: Number, default: 10 },
	cash   : { type: Number, default: 0 },
	attributes : {
		attack       : { type: Number, default: 5 },
		defense      : { type: Number, default: 5 },
		agility      : { type: Number, default: 5 },
		intelligence : { type: Number, default: 5 },
		willpower    : { type: Number, default: 5 },
		charisma     : { type: Number, default: 5 },
		unassigned   : { type: Number, default: 3 }
	},
	weaponSkills : {
		handToHand : { type: Number, default: 0 },
		staff      : { type: Number, default: 0 },
		knife      : { type: Number, default: 0 },
		knifeThrow : { type: Number, default: 0 },
		spear      : { type: Number, default: 0 },
		spearThrow : { type: Number, default: 0 },
		shortSword : { type: Number, default: 0 },
		lightSword : { type: Number, default: 0 },
		heavySword : { type: Number, default: 0 },
		lightAxe   : { type: Number, default: 0 },
		heavyAxe   : { type: Number, default: 0 },
		lightClub  : { type: Number, default: 0 },
		heavyClub  : { type: Number, default: 0 },
		shortBow   : { type: Number, default: 0 },
		longBow    : { type: Number, default: 0 },
		crossBow   : { type: Number, default: 0 },
		handgun    : { type: Number, default: 0 },
		shotgun    : { type: Number, default: 0 },
		rifle      : { type: Number, default: 0 },
		submachineGun : { type: Number, default: 0 },
		assaultRifle  : { type: Number, default: 0 },
		sniperRifle : { type: Number, default: 0 },
		rpg         : { type: Number, default: 0 },
		molotov     : { type: Number, default: 0 },
		grenade     : { type: Number, default: 0 },
		explosives  : { type: Number, default: 0 }
	},
	equipment : {
		head                  : { type: String, ref: 'UserArmor' },
		chest                 : { type: String, ref: 'UserArmor' },	
		leftHand              : { type: String, ref: 'UserWeapon' },
		rightHand             : { type: String, ref: 'UserWeapon' },
		legs                  : { type: String, ref: 'UserArmor' },	
		feet                  : { type: String, ref: 'UserArmor' },
	}
});

userSchema.methods.createdFromNow = function() {
    return moment(this.createdAt).fromNow();
};

userSchema.methods.comparePassword = function(password, callback) {
	bcrypt.compare(password, this.password, callback);
};

userSchema.pre('save', function saveHook(next) {
	const user = this;
  
  	// proceed further only if the password is modified or the user is new
  	if (!user.isModified('password')) return next();

	return bcrypt.genSalt((saltError, salt) => {
		if (saltError) { return next(saltError); }

		return bcrypt.hash(user.password, salt, (hashError, hash) => {
			if (hashError) { return next(hashError); }

			// replace a password string with hash value
			user.password = hash;

			return next();
		});
	});
});

module.exports = mongoose.model('User', userSchema);