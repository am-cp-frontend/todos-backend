const databaseWrapper = require('./databaseWrapper')

const schemas = require('./schema/schemas')
const matchesSchema = require('./schema/matchesSchema')

const db = databaseWrapper()

const makeResponse = todos => ({
  response: todos
})

module.exports = app => {
  app.get('/todos/:hash', (req, res) => {
    const root = db.getRoot()
    const hash = req.params.hash

    const todos = root.todos[hash]

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
    const todo = JSON.parse(req.body)

    if (matchesSchema(todo, schemas.additionSchema)) {
      todos.push({
        text: todo.text,
        done: todo.done || false
      })

      res.send({
        response: 'ok'
      })
    } else {
      res.send({
        error: 'Invalid request format'
      })
    }

    res.end()    
  })

  app.delete('/todos/:hash', (req, res) => {
    const root = db.getRoot()

    const hash = req.params.hash

    const todos = root.todos[hash]
    const options = JSON.parse(req.body)

    if (matchesSchema(options, schemas.deletionSchema)) {
      todos.splice(options.index, 1)

      res.send({
        response: 'ok'
      })
    } else {
      res.send({
        error: 'Invalid request format'
      })
    }
  })

  app.put('/todos/:hash', (req, res) => {
    const root = db.getRoot()

    const hash = req.params.hash

    const todos = root.todos[hash]
    const options = JSON.parse(req.body)

    if (matchesSchema(options, schemas.editingSchema)) {
      if (!todos[options.index]) {
        res.send({
          error: 'No todo at such index is present'
        })
        
        return
      }

      const todo = todos[options.index]

      todo.text = options.hasOwnProperty('text') ? options.text : todo.text
      todo.done = options.hasOwnProperty('done') ? options.done : todo.done

      res.send({
        response: 'ok'
      })
    } else {
      res.send({
        error: 'Invalid request format'
      })
    }
  })
}