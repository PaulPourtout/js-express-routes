// Configure express
var express = require('express');
var app = express();

// Import EJS
var ejs = require('ejs');
app.set('view engine', 'ejs');

// Import data users
var users = require('./model/data.js');
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
// Defining routes
// app.get('/', function(req, res) {
// 	res.send('Ceci est une Home Page (même si elle n\'en a pas l\'air).');
// })

app.get('/', function(req, res) {
	// console.log(firebase.auth().user);
  res.render('./pages/index.ejs', {users: users});
})

.get('/user/:id', function(req, res) {
  res.render('./pages/user.ejs', {
    user: users[req.params.id]
  });
})

.get('/projects', function(req, res) {
	res.render('./pages/projects.ejs', { projects: projects });
})

.get('/project/:id', function(req ,res) {
	const project = projects[req.params.id];
	console.log(project);
	console.log(project.userId);
	const user = users[project.userId];
	console.log(user);

	res.render('./pages/project.ejs', {
		project : project,
		user: user
	});
})

.get('/*', function(req, res) {
  res.status(404).render('./pages/error.ejs');
})

.listen(5000, function(req, res) {
  console.log('The server is OK. Now you can connect to localhost:5000.');
});
