// Configure express
const express = require('express');
const app = express();
const chalk = require('chalk');
const promise = require('es6-promise');
promise.polyfill();
const errorHandler = require('error-handler');
const port = process.env.PORT || 5000;
// Import EJS
const ejs = require('ejs');
app.set('view engine', 'ejs');

// Import data
const users = require('./model/data.js');
const formateurs = require('./model/formateurs.js');
const projects = require('./model/projects.js');

// Static route
app.use(express.static(__dirname + '/public'));

// Building middleware
const logReqType = function(req, res, next) {
	const dateNow = function now() {
		const sec = new Date().getSeconds();
		const min = new Date().getMinutes();
		const hour = new Date().getHours();
		const day = new Date().getDate();
		const month = new Date().getMonth();
		const year = new Date().getFullYear();
		return `${hour}:${min}:${sec} ${day}/${month}/${year}`;
	};
	console.log(chalk.yellow('request method : ' + req.method + ' url: "' + req.url + '" at ' + dateNow()));
	next();
};

// Calling Middleware
app.use(logReqType);

app.get('/', function(req, res) {
	// console.log(firebase.auth().user);
  res.render('./pages/index.ejs');
})

.get('/formulaire', function(req, res) {
	res.render('./pages/formulaire.ejs');
})

.post('/formulaire', function(req, res) {
	res.redirect('/');
})

.get('/users', function(req ,res) {
	res.render('./pages/users.ejs', {users: users});
})

.get('/user/:id', function(req, res) {
		// Check if user exists
	const user = users.find( function(item) {
		return item.id === Number(req.params.id);
	});

	// If user existe
	if (user) {
	// Filter user projects in projects db
	const projectsUser =
		projects.filter(function(project){
			return project.userId === user.id;
		});
	  // Call the user page
	  res.render('./pages/user.ejs', {
		user: user,
		projects: projectsUser
	  });
	}
	// If user doesn't exists
	else {
		res.redirect('/error');
	}
})


.get('/user/:id/projects', function(req, res) {
	const userProjects = projects.filter(function(project) {
		return project.userId === users[req.params.id].id;
	});
	res.render('./pages/user-projects.ejs', {
		user: users[req.params.id],
		projects: userProjects
	});
})

.get('/projects', function(req, res) {
	res.render('./pages/projects.ejs', { projects: projects });
})

.get('/project/:id', function(req ,res) {
	const project = projects[req.params.id];
	const user = users[project.userId];

	res.render('./pages/project.ejs', {
		project : project,
		user: user
	});
})

.get('*', function(req, res) {
  res.status(404).render('./pages/error.ejs');
})


.listen(port, function(req, res) {
  console.log('The server is OK. Now you can connect to localhost:5000.');
});
