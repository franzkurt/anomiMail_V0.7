const SHA256 = require('crypto-js/sha256');
var crypto = require('crypto');

class Packet {
  constructor() {
    this.letterList = []
    this.signature = '';
    this.PostmanPublicKey = '';
  }

  isValid() {
    if (!this.signature || this.signature.length === 0) {
      return false;
    }
    const hashTx = this.calculateHash();
    var verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(hashTx);
    return verifier.verify(this.PostmanPublicKey, this.signature, 'hex');
  }

  calculateHash() {
    return SHA256(this.PostmanPublicKey + this.letterList).toString();
  }

  addOwner(packetOwnerPuKey) {
    this.PostmanPublicKey = packetOwnerPuKey;
  }

  validateQuantityOfLetters() {
    const VALOR_MINIMO_MSG = 1;
    if (this.letterList.length < VALOR_MINIMO_MSG)
      return "Adicione mais " + (VALOR_MINIMO_MSG - this.letterList.length) + " letters"
    return true
  }

  signPacket(privateKey, passphrase) {
    if (!this.validateQuantityOfLetters()) {
      return false;
    }
    const hashTx = this.calculateHash();
    var sign = crypto.createSign('RSA-SHA256');
    sign.update(hashTx);

    const signObj = {
      key: privateKey,
      passphrase: passphrase
    }
    this.signature = sign.sign(signObj, 'hex');
    return {
      error: false,
      message: "Successfully signed with: " + this.signature
    }
  }

  addLetter(newLetter) {
    return this.letterList.push(newLetter.payload);
  }
}
module.exports = Packet;
