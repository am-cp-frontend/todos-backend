const md5 = require('md5')
const databaseWrapper = require('./databaseWrapper')

const db = databaseWrapper()

module.exports = app => {
  app.get('/register/:email', (req, res) => {
    const root = db.getRoot()

    const hash = md5(req.params.email)

    root.todos[hash] = root.todos[hash] || []

    res.send(hash)
    res.end()
  })
}