const databaseWrapper = require('./databaseWrapper')

const db = databaseWrapper()

// const root = db.getRoot()

const headers = {
  'Access-Control-Allow-Origin': '*'
}

const makeResponse = todos => ({
  response: todos
})

module.exports = app => {
  app.get('/todos/:hash', (req, res) => {
    const root = db.getRoot()
    const hash = req.params.hash

    console.log(root)

    const todos = root.todos[hash]

    res.set(headers)

    if (!root.todos.hasOwnProperty(hash)) {
      res.send({
        error: 'No such hash in the database'
      })
    } else {
      res.send(makeResponse(todos))
    }

    res.end()
  })

  app.post('/todos/:hash', (req, res) => {
    const root = db.getRoot()

    const hash = req.params.hash

    const todos = root.todos[hash]
    const todo = req.body

    res.set(headers)

    if (todo.todoText) {
      todos.push(todo.todoText)

      res.send({
        result: 'ok'
      })
    } else {
      res.send({
        error: 'Invalid request format'
      })
    }

    res.end()    
  })
}