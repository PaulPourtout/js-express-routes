// Configure express
var express = require('express');
var app = express();
var chalk = require('chalk');
var port = process.env.PORT || 5000;
// Import EJS
var ejs = require('ejs');
app.set('view engine', 'ejs');

// Import data users
var users = require('./model/data.js');
var formateurs = require('./model/formateurs.js');
// var firebase = require('firebase');

// Import data projects
var projects = require('./model/projects.js');

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
// var config = {
//   apiKey: "AIzaSyA88-qaOkFbx0_1vLM6q3uLPJvYuFHdicE",
//   authDomain: "users-list-77a0a.firebaseapp.com",
//   databaseURL: "https://users-list-77a0a.firebaseio.com",
//   storageBucket: "users-list-77a0a.appspot.com"
// };
// firebase.initializeApp(config);
//
// var db = firebase.database();
//
// function writeUserData(userId, username, description) {
//   db.ref('users/' + userId).set({
// 	  userId: userId,
//     username: username,
// 	description: description
//   });
// }
// writeUserData(0 , 'michou', 'michou est le plus beau');

// db.ref('users').on('value', (snapshot) => console.log(snapshot.val()));

// Static route
app.use(express.static(__dirname + '/public'));

// Building middleware
var logReqType = function(req, res, next) {
	const dateNow = function now() {
		const sec = new Date().getSeconds();
		const min = new Date().getMinutes();
		const hour = new Date().getHours();
		const day = new Date().getDate();
		const month = new Date().getMonth();
		const year = new Date().getFullYear();
		return `${hour}:${min}:${sec} ${day}/${month}/${year}`;
	};
	console.log(chalk.yellow('request method : ', req.method, ' url: ', req.url ,' at ', dateNow()));
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

.get('/*', function(req, res) {
  res.status(404).render('./pages/error.ejs');
})

.listen(port, function(req, res) {
  console.log('The server is OK. Now you can connect to localhost:5000.');
});
