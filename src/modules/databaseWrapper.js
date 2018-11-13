// npm dependencies
const fs = require('fs');
// module requirements
const logging = require('./logging');
const curry = require('./curry');
// dependency init
const log_instance = logging();
const log = curry.call(log_instance, log_instance.log)('DatabaseWrapper');

var databaseWrapper = (() => {

  class DatabaseWrapper {
    constructor(filename, autosave) {
      this._ramcopy = {};
      this._filename = filename;
      this.forceUpdate();
      var self = this;
      setInterval(() => {
        self.forceDump();
      }, autosave * 60 * 1000);
    }

    forceUpdate() {
      if(!this._filename) return;
      // let self = this;
      return new Promise((resolve, reject) => {
        fs.readFile(this._filename, (err, data) => {
          if (err) {
            log('Error reading database JSON file from disk: ' + err.toString());
            resolve(true);
          }
          try {
            this._ramcopy = JSON.parse(data);
          } catch (e) {
            log('Unsupported database file format.');
            this.forceDump();
            resolve(false);
          }

          log('JSON loaded into RAM copy.');
          resolve(false);
        });
      });
    }

    forceDump() {
      log('Dumping current database state to disk.')
      if(!this._filename) return false;
      return new Promise((resolve, reject) => {
        fs.writeFile(this._filename, JSON.stringify(this._ramcopy), (err) => {
          if (err) {
            log('Error dumping database state: ' + err.toString());
            resolve(true);
          } else {
            log('Database state successfully dumped.');
            resolve(false);
          }
        });
      });
    }

    getRoot() {
      return this._ramcopy;
    }

  }

  return DatabaseWrapper;

}) ();

let db;

module.exports = (filename, autosave) => {
  if(!db)
    db = new databaseWrapper(filename, autosave);
  return db;
};