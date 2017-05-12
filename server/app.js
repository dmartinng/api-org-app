// server/app.js
const express = require('express');
const path = require('path');
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

fs.open(path.resolve(__dirname, '..', 'tasks.json'), 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('tasks.json already exists');
      return;
    }

    throw err;
  }

  fs.writeFile(path.resolve(__dirname, '..', 'tasks.json'), JSON.stringify({tasks: []}), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("tasks.json file was saved!");
  });
});

fs.open(path.resolve(__dirname, '..', 'notes.json'), 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('notes.json already exists');
      return;
    }

    throw err;
  }

  fs.writeFile(path.resolve(__dirname, '..', 'notes.json'), JSON.stringify({notes: []}), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("notes.json file was saved!");
  });
});

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.get('/api/tasks', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'tasks.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {
    res.send(JSON.stringify(obj));
  })
});

app.post('/api/tasks/create', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'tasks.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {

    var newTask = {
      "id": randomString(8),
      "entry": req.body.entry || "",
      "completed": false
    }
    var data = obj;
    data.tasks.push(newTask);
    jsonfile.writeFile(file, data, function(err) {
      console.error(err);
      res.send(JSON.stringify(newTask));
    })
  })
});

app.post('/api/tasks/toggle', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'tasks.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {
    // console.log(obj)
    var data = obj.tasks;
    var taskToChange = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == req.body.id) {
        data[i].completed = !data[i].completed
        taskToChange = data[i]
      }
    }

    var dataToWrite = {tasks: data}

    jsonfile.writeFile(file, dataToWrite, function(err) {
      console.error(err);
      res.send(JSON.stringify(taskToChange));
    })

  })
})

app.post('/api/tasks/delete', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'tasks.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {
    // console.log(obj)
    var data = obj.tasks;
    var filteredData = data.filter((row) => row.id != req.body.id)

    jsonfile.writeFile(file, {tasks: filteredData}, function(err) {
      console.error(err);
      res.send(JSON.stringify(filteredData));
    })

  })
})

/* NOTES */

app.get('/api/notes/', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'notes.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {
    res.send(JSON.stringify(obj));
  })
});

app.get('/api/notes/:id', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'notes.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {

    var data = obj.notes;
    var noteToReturn = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == req.params.id) {
        noteToReturn = data[i]
      }
    }

    res.send(JSON.stringify(noteToReturn));

  })
});

app.post('/api/notes/create', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'notes.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {

    var newNote = {
      "id": randomString(8),
      "title": "",
      "text": "",
      "last_updated": Date.now()
    }
    var data = obj.notes;
    data.push(newNote);
    jsonfile.writeFile(file, {notes: data}, function(err) {
      console.error(err);
      res.send(JSON.stringify(newNote));
    })
  })
});

app.post('/api/notes/edit', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'notes.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {

    var data = obj.notes;
    var noteToChange = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == req.body.id) {
        data[i].text = req.body.text;
        data[i].title = req.body.title;
        data[i].last_updated = Date.now();
        noteToChange = data[i]
      }
    }

    var dataToWrite = {notes: data}

    jsonfile.writeFile(file, dataToWrite, function(err) {
      console.error(err);
      res.send(JSON.stringify(noteToChange));
    })

  })
});

app.post('/api/notes/delete', (req, res, next) => {
  var file = path.resolve(__dirname, '..', 'notes.json')

  res.setHeader('Content-Type', 'application/json');
  jsonfile.readFile(file, function(err, obj) {
    // console.log(obj)
    var data = obj.notes;
    var filteredData = data.filter((row) => row.id != req.body.id)

    jsonfile.writeFile(file, {notes: filteredData}, function(err) {
      console.error(err);
      res.send(JSON.stringify(filteredData));
    })

  })
});


module.exports = app;
