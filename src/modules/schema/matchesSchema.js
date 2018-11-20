module.exports = (request, schema) => {
  for (let key in schema) {
    if (!schema[key].optional && !request.hasOwnProperty(key)) return false
    else if (schema[key].optional && !request.hasOwnProperty(key)) continue
    else if (typeof request[key] !== schema[key].type) return false
  }

  return true
}