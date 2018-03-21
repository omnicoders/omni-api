const User = require('../models/User');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');
if (!process.env.JWT_SECRET){ require('../config/env.js'); }

module.exports = function(app) {
	
	// create new project
	app.post("/projects/new", adminRequired, (req, res) => {
		let newProject = new Project({
			user: req.locals.currentUser._id,
			name: req.body.name,
			description: req.body.description,
			repoUrl: req.body.repoUrl,
			demoUrl: req.body.demoUrl
		});
		newProject.save((error, project) => {
			let jsonResponse;
			if(error){
				jsonResponse = {
					message: "There was a problem saving the new Project to the DB.",
					project: {}
				};
			} else {
				jsonResponse = {
					message: "The new Project was successfully saved to the DB.",
					project: project
				};
			}
			res.json(jsonResponse);
		});
	});	

	// remove project
	app.post("/projects/:projectId/remove", adminRequired, (req, res) => {
		Project
		.findByIdAndRemove(req.params.projectId)
		.exec((error) => {
			if(error){
				jsonResponse = {
					message: "There was a problem removing the Project from the DB."
				};
			} else {
				jsonResponse = {
					message: "The Project was successfully removed from the DB."
				};
			}
			res.json(jsonResponse);
		});
	});	

	// edit project
	app.post("/projects/:projectId/edit", adminRequired, (req, res) => {
		Project
		.findOne({'_id': req.params.projectId})
		.exec((err, project) => {
			project.name = req.body.name;
			project.description = req.body.description;
			project.repoUrl = req.body.repoUrl;
			project.demoUrl = req.body.demoUrl;
			project.save((error, updatedProject) => {
				let jsonResponse;
				if(error){
					jsonResponse = {
						message: "There was a problem saving the updated Project to the DB.",
						project: project
					};
				} else {
					jsonResponse = {
						message: "The updated Project was successfully saved to the DB.",
						project: updatedProject
					};
				}
				res.json(jsonResponse);
			});
		});
	});	

	// show one project
	app.get("/projects/:projectId", getProjectById, (req, res) => {
		let jsonResponse = {
			message: res.locals.message,
			project: res.locals.project
		};
		res.json(jsonResponse);
	});	

	// list all projects
	app.get("/projects", getAllProjects, (req, res) => {
		let jsonResponse = {
			message: res.locals.message,
			projects: res.locals.projects
		};
		res.json(jsonResponse);
	});	

};

function getAllProjects(req, res, next) {
	Project
	.find({}, {}, {sort: {name: 1}})
	.populate('user')
	.exec((error, projects) => {
		if(error) {
			res.locals.message = "There was a problem with retrieving the Project records from the DB.";
		} else {
			res.locals.message = "The Project records were successfully retrieved from the DB.";
		}
		res.locals.projects = projects;
		return next();
	});
}

function getProjectById(req, res, next) {
	Project
	.findOne({'_id': req.params.projectId})
	.populate('user')
	.exec((error, project) => {
		if(error) {
			res.locals.message = "There was a problem with retrieving the Project record from the DB.";
		} else {
			res.locals.message = "The Project record was successfully retrieved from the DB.";
		}
		res.locals.project = project;
		return next();
	});
}

function adminRequired(req, res, next) {
	if(!req.token){
		res.status(401).json({
			message: "You do not have access."
		});
		next();
	} else {
		jwt.verify(req.token, process.env.JWT_SECRET, (error, decoded) => {
			if(error){
				console.log(error);
				res.status(401).json({
					message: "You do not have access."
				});
				next();				
			} else {
				let userId = decoded.sub;
				User
				.findOne({'_id': userId})
				.exec((error, user) => {
					if(error || !user){
						res.status(401).json({
							message: "You do not have access."
						});
						next();
					} else {
						if(user.isAdmin){
							res.locals.currentUser = user;
							next();
						} else {
							res.status(401).json({
								message: "You need to be an Admin to perform this action on the API."
							});
							next();
						}
					}
				});
			}
		});
	}
}