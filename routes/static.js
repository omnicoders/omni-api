module.exports = function(app) {
	
	// landing page route
	app.get("/", (req, res) => {
		let jsonResponse = {
			message: "Welcome to the Omni Coders JSON API."
		};
		res.json(jsonResponse);
	});
	
};	