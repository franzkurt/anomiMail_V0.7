const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('ff97d309f21d0a3f948afd8b301fcd69efc1b99bb91292e4f3f9315e3fcefefd');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 1);
tx1.signTransaction(myKey);
savjeeCoin.addTransaction(tx1);

// Mine block
savjeeCoin.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 1);
tx2.signTransaction(myKey);
savjeeCoin.addTransaction(tx2);

// Mine block
savjeeCoin.minePendingTransactions(myWalletAddress);
console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`);
