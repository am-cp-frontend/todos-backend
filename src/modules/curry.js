function curry(func) {
  let context = this;

  function next(given, args) {
    given = given.concat(args);

    if(given.length === func.length) {
      return func.call(context, ...given);
    } else {
      return make_adapter(given);
    }
  }

  function make_adapter(given) {
    return function() {
      return next(given, [...arguments]);
    }
  }

  return make_adapter([]);
}

module.exports = curry;
