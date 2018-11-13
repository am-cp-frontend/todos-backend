// npm dependencies
const fs = require('fs');
const dateformat = require('dateformat');

var logging = (() => {
  class Logging {
    constructor(flags) {
      var self = this;
      this._log_to_stdout = flags.stdout;
      this._log_to_file = flags.file;
      if (this._log_to_file) {
        this._stream = fs.createWriteStream(flags.file);
      }
      this._log = [];
    }

    destruct() {
      this._stream.close();
    }

    log(caller, message) {
      let formatted = '[' + dateformat(Date.now(), 'mm/dd/yy HH:MM') + ']' +
        '[' + caller + '] ' + message;
      // this._log.push(formatted);
      if (this._log_to_stdout) console.log(formatted);
      if (this._log_to_file) this._stream.write(formatted + '\n');
    }

    fetch_log() {
      return this._log.slice();
    }
  }

  return Logging;
}) ();


let log;

module.exports = (flags) => {
  if (!log) {
    log = new logging(flags);
  }
  return log;
};