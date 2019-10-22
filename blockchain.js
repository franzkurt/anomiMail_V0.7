const SHA256 = require('crypto-js/sha256');
const Packet = require('./packet');
var encrypt = require('./encription');

class Block {
  constructor(previousHash, packets, minerPublicKey) {
    this.previousHash = previousHash;
    this.timestamp = +new Date();
    this.packets = packets;
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.miner = minerPublicKey;
  }

  calculateHash() {
    let r = this.miner + this.previousHash + this.timestamp + JSON.stringify(this.packets) + this.nonce
    return SHA256(r).toString();
  }


  mineBlock(difficulty) {
    // let ooo = Buffer.from('Hello World!').toString('hex')
    // Buffer.from(b64Encoded, 'base64').toString()
    if (!this.hasValidPackets())
      return false
    difficulty = difficulty || 1;
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }

  hasValidPackets() {
    for (const pct of this.packets) {
      if (!pct.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingPackets = [];
  }

  createGenesisBlock() {
    return new Block('0', [], '');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingPackets(miningRewardAddress) {
    if (this.pendingPackets.length < 1)
      return "sem packets para minerar"

    let block = new Block(this.getLatestBlock().hash, this.pendingPackets, miningRewardAddress);

    let currentTimestamp = +new Date();
    if ((currentTimestamp - this.getLatestBlock().timestamp) / 60 * 1000 < 1) {
      return "espere 1 minuto para minerar mais um bloco"
    }

    let difficulty = this.getMinerLevel(miningRewardAddress);
    block.mineBlock(difficulty);
    this.chain.push(block);
    this.pendingPackets = [];
  }

  addPacket(packet) {
    // Verify the transactiion
    if (!packet.isValid()) {
      throw new Error('Cannot add invalid signed packet to chain');
    }
    // add forward de outros baseado no level ====
    this.pendingPackets.push(packet);
  }

  getMinerLevel(minerPublicKey) {
    let balance = 1;

    for (const block of this.chain) {
      if (block.miner === minerPublicKey) {
        ++balance;
      }
    }
    return Math.ceil(Math.log10(balance));
  }

  isChainValid() {
    // validate genesis block
    let genesisBlock = this.chain[0];
    if (genesisBlock.packets.length !== 0 ||
      genesisBlock.previousHash !== '0' ||
      genesisBlock.miner.length !== 0) {
      return false
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      if (!currentBlock.hasValidPackets()) {
        return 1;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return 2;
      }
    }
    return true;
  }

  readAll(readerPrivateKey, passphrase) {
    let messagesForMe = []
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      messagesForMe.push(this.readBlock(readerPrivateKey, passphrase, currentBlock))
    }
    return messagesForMe;
  }

  readLatestBlock(readerPrivateKey, passphrase) {
    return this.readBlock(readerPrivateKey, passphrase, this.getLatestBlock());
  }

  readBlock(readerPrivateKey, passphrase, block) {
    let messagesToMe = [];
    let forwardsToMe = [];

    // decrypt all letters inside each packet
    for (let pct of block.packets) {
      for (let letter of pct.letterList) {
        var data = encrypt.decryptStringWithRsaPrivateKey(letter.header, readerPrivateKey, passphrase)
        if (data.error)
          continue;

        // to decrypt we pass a object JSON
        let obj = JSON.parse(data)

        let decrypted = encrypt.symetricDecrypt(letter.data, obj.pass, obj.iv)
        decrypted = JSON.parse(decrypted)

        // if has more then one message
        if (Array.isArray(decrypted))
          decrypted = decrypted.map(d => {
            return JSON.parse(d)
          })

        // type == 1 means message to read
        // type == 2 means message to forward
        obj.type === 1 ? messagesToMe.push(decrypted) : forwardsToMe.push(decrypted)
      }
    }
    return {
      forwardsToMe: forwardsToMe,
      messagesToMe: messagesToMe
    }
  }

}

module.exports = Blockchain;
module.exports.Block = Block;
