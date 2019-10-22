var crypto = require("crypto");
var algorithm = 'aes-256-gcm'

class Encrypt {

  encryptWithPublicKey(content, publicKey) {
    var buffer = new Buffer.from(content);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
  };

  symetricEncript(content, pass, iv) {
    var cipher = crypto.createCipheriv(algorithm, pass, iv)
    var encrypted = cipher.update(content, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return {
      content: encrypted,
      tag: tag
    };
  }

  decryptStringWithRsaPrivateKey(toDecrypt, privateKey, passphrase) {
    try {
      var buffer = new Buffer.from(toDecrypt, "base64");
      const decrypted = crypto.privateDecrypt({
          key: privateKey.toString(),
          passphrase: passphrase,
        },
        buffer,
      )
      return decrypted.toString("utf8");
    } catch (err) {
      return {
        error: true,
        message: "impossivel ler"
      }
    }
  };

  symetricDecrypt(encriptedContent, pass, iv) {
    var decipher = crypto.createDecipheriv(algorithm, pass, iv)
    let tag = encriptedContent.tag;
    if (typeof(encriptedContent.tag.type) !== 'undefined')
      tag = Buffer.from(encriptedContent.tag.data)
    decipher.setAuthTag(tag);
    var dec = decipher.update(encriptedContent.content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  }
}

module.exports = new Encrypt();
