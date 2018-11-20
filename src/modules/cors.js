const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

module.exports = app => {
  app.use('/todos/:hash', (req, res, next) => {
    res.set(headers)

    next()
  })
}
