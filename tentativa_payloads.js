const SHA256 = require('crypto-js/sha256');
var crypto = require("crypto");
var encrypt = require('./encription');

class Letter {
  constructor(level) {
    this.messages = [];
    this.recipientPuKey = '';
    this.payload = '';
    // To remove
    this.level = level;
  }

  isValid() {
    if (this.payload == '' || this.payload.header.length === 0 || this.payload.data.length === 0) {
      return {
        error: true,
        message: "The payload is empty"
      }
    }
    return {
      error: false,
      message: "The letter is valid"
    };
  }

  addMessage(message) {
    if (typeof(message) !== 'string' || message.length <= 0) {
      return {
        error: true,
        message: 'The message is not a string or is empty'
      }
    }
    this.messages.push(message)
    return {
      error: false,
      message: 'The message was added to this letter'
    }
  }

  addRecipient(recipient) {
    if (typeof(recipient) !== 'string' || recipient.length <= 0) {
      return {
        error: true,
        message: 'The recipient is not a string or is empty'
      }
    }
    if (this.recipientPuKey !== '' || this.recipientPuKey.length > 0) {
      return {
        error: true,
        message: 'This letter already has a recipient added'
      }
    }
    this.recipientPuKey = recipient

    return {
      error: false,
      message: 'The recipient was added to this letter'
    }
  }

  seal() {
    if (this.messages.length === 0) {
      return {
        error: true,
        message: "The list of messages is empty"
      }
    }
    if (this.recipientPuKey.length === 0) {
      return {
        error: true,
        message: "The recipient of this letter was not set"
      }
    }
    if (this.writerLevel < 2) {
      return {
        error: true,
        message: "The writer need mine some more blocks before sent the first message"
      }
    }

    let newPass = this.gererateNewPassword()
    let newIv = this.gererateNewPassword()

    let header = JSON.stringify({
      type: 1,
      pass: newPass,
      iv: newIv,
    });

    this.payload = {
      // encripta a chave de acesso da mensagem para o destino
      header: encrypt.encryptWithPublicKey(header, this.recipientPuKey),
      // encripta os dados da Mensagem
      data: encrypt.symetricEncript(JSON.stringify(this.messages), newPass, newIv),
    }
    this.sealed = true;

    return {
      error: false,
      message: "success sealing the letter"
    }
  }

  gererateNewPassword() {
    let newPass = crypto.randomBytes(50).toString("hex");
    return SHA256(newPass).toString().slice(0, 32);
  }

  addForwarder(fwPublicKey) {
    if (!this.payload) {
      return {
        error: true,
        message: "The letter doesn't have a payload, possibly it was not sealed"
      }
    }

    let newPass = this.gererateNewPassword()
    let iv = this.gererateNewPassword()

    // add a forwarder header
    var header_fw = {
      type: 2,
      pass: newPass,
      iv: iv,
      id: 0,
      hash: SHA256(this.payload)
    };

    console.log(JSON.stringify(this.payload).length)
    let tamanho = 3000 - JSON.stringify(this.payload).length;
    // add some unuseful chars
    if(tamanho > 0){
      let zeros = '0';
      for (var i = 0; i < tamanho-12; i++) zeros +='0';
      this.payload.zeros = zeros
    }

    let payloadCopy = JSON.stringify(this.payload);
    let tamanho2 = payloadCopy.length;
    let payloads = []
    while (payloadCopy.length > 0) {
      let chunck = payloadCopy.slice(0,3000)
      payloads.push({
        header: encrypt.encryptWithPublicKey(JSON.stringify(header_fw), fwPublicKey),
        data: encrypt.symetricEncript(chunck, newPass, iv)
      })
      ++ header_fw.id;
      payloadCopy = payloadCopy.slice(3000*header_fw.id,tamanho2);
    }

    // this.payload = payloads
    return {
      error: false,
      message: "The forwarder was added with success"
    }
  }
}
module.exports = Letter;
