var crypto = require("crypto");

class Message {
  constructor(text, extra) {
    this.text = text; // texto escrito
    this.extra = extra; // obj anexo
    this.timestamp = + new Date(); // ordena no receptor
  }

  isValid() {
    if (typeof(this.text) !== 'string' || typeof(this.extra) !== 'string')
      return false;
    return true;
  }
}

module.exports = Message
