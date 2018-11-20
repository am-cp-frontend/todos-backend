const schemas = {}

schemas.deletionSchema = {
  index: {
    type: 'number',
    optional: false
  }
}

schemas.additionSchema = {
  text: {
    type: 'string',
    optional: false
  },

  done: {
    type: 'boolean',
    optional: true
  }
}

schemas.editingSchema = {
  index: {
    type: 'number',
    optional: false
  },

  text: {
    type: 'string',
    optional: true
  },

  done: {
    type: 'boolean',
    optional: true
  }
}

module.exports = schemas