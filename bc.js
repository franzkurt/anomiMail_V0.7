const Blockchain = require('./blockchain');
const Packet = require('./packet');
const Letter = require('./letter');

const {
  generateKeyPairSync
} = require('crypto')

// password de uso da chave privada
const PASSPHRASE = "himpfijdsfjdsif"

function getKeys(n) {
  keys = [];
  for (var i = 0; i < n; i++) {
    keys.push(generateKeyPairSync('rsa', {
      modulusLength: 4096,
      namedCurve: 'secp256k1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: PASSPHRASE
      }
    }));
  }
  return keys
}

// console.log(new Date())
PU = getKeys(5); // new chat

// console.log(new Date())
// console.log(JSON.stringify(PU))

//
// PU[0]:novo chat iniciador
// PU[1]:novo chat resposta
// PU[2]:chave do escritor
// PU[3]:chave do remetente
// PU[3]:chave do forwarder

// resposta da mensagem 1 será para PU[0]
var mensagem = ["oi Jefersom, utiliza essa chave pra falar comigo", PU[0].publicKey]
// resposta da mensagem 2 será para PU[1]
var mensagem2 = ["Ok, é voce jorisbal?", PU[1].publicKey]
// fim do handshake
var mensagem3 = ["Sim meu", PU[0].publicKey]
var chaveJefersom = PU[3]; // remetente
var chaveFranz = PU[2] // escritor
var chavePedro = PU[4]; // encaminhador

// create letter
let letterToJeferson = new Letter(4)
letterToJeferson.addMessage(JSON.stringify(mensagem))
letterToJeferson.addRecipient(chaveJefersom.publicKey)
letterToJeferson.seal()
// letterToJeferson.isValid()
letterToJeferson.addForwarder(chavePedro.publicKey)

// create packet with letters
let packet = new Packet()
packet.addOwner(chaveFranz.publicKey)
packet.addLetter(letterToJeferson)
packet.signPacket(chaveFranz.privateKey, PASSPHRASE)

// create blockchain
const Chain = new Blockchain();
Chain.addPacket(packet);

// I receive points if miner, optionally
Chain.minePendingPackets(chaveFranz.publicKey)

// THE READER OS THE CHAIN ACTS HERE
var a = Chain.readLatestBlock(chavePedro.privateKey, PASSPHRASE)

let packet2 = new Packet()
packet2.addOwner(chavePedro.publicKey)
packet2.addLetter({payload:a.forwardsToMe[0]})
packet2.signPacket(chavePedro.privateKey, PASSPHRASE)

Chain.addPacket(packet2);
Chain.minePendingPackets(chaveFranz.publicKey)

var a = Chain.readLatestBlock(chaveJefersom.privateKey, PASSPHRASE)
console.log(a.messagesToMe[0])

// pct.signPacket(PU[3].privateKey, PASSPHRASE)
//
// Chain.addPacket(pct);
// Chain.minePendingPackets(chaveFranz.publicKey)
// var a = Chain.readAll(PU[2].privateKey)
// console.log(a)

// console.log('Blockchain valid?', Chain.isChainValid() );
