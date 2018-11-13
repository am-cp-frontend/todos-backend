const express = require('express')
const bodyParser = require('body-parser')
const dateformat = require('dateformat')

const logging = require('./modules/logging');

logging({
  'stdout': true,
  'file': __dirname + '/logs/run-' + dateformat(new Date(), 'mm-dd-yyyy_HH-MM') + '.log'
});

const database = require('./modules/databaseWrapper');
const db = database('db.json', 7);

const setupRegisterRoute = require('./modules/register')
const setupTodoRoute = require('./modules/todos')

const defaultDatabaseState = () => ({
  todos: {}
})

const app = express()
app.use(bodyParser.text())

setupRegisterRoute(app)
setupTodoRoute(app)

let server;

db.forceUpdate().then(() => {
  const root = db.getRoot()

  if (!root.todos) Object.assign(root, defaultDatabaseState())

  server = app.listen(8080)
})

var safe_exit = () => {
  db.forceDump().then(() => {
    server.close()
    process.exit(0);
  });
};

process.title = 'todos-backend';
process.on('SIGINT', safe_exit);
process.on('SIGTERM', safe_exit);