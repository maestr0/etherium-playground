// Get private stuff from my .env file
import {
  my_privkey,
  infura_api_key
} from '../.env'

// Need access to my path and file system
import path from 'path'
// var fs = require('fs');

// Ethereum javascript libraries needed
// import web3 from 'Web3'
var Tx = require('ethereumjs-tx');

/* Call the contract using web3-
 *
 * To run:
 *
 *        nvm use 7.2.1
 *       ./node_modules/babel-cli/bin/babel-node.js --presets es2015 ./tests/callcontract.js
 *
 */

import fs from "fs";
import Web3 from 'web3';

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/j2AjN0PnreWx1hGzLhDv'));

var sender = "0x527c809fc45cc10fd749aadbb298cd98319e5649"
var recipent = "0x8d77e459622e56270e323e6795fe10393b214756"
var contractAddress = "0xd091d560935c6966914c0d689740fc2a8088f21a"



// Fetch ABI
var abiArray = JSON.parse(fs.readFileSync('./tt3.json', 'utf-8'));
console.log("1");
// Get a proxy on our Ropsten contract
let contract = web3.eth.contract(abiArray).at(contractAddress);
console.log("3");

var balance = web3.eth.getBalance(sender);
console.log(balance.toNumber() + " ETH"); // instanceof BigNumber

console.log(contract.balanceOf(sender).toNumber() + " OATH")

var data = contract.transfer.getData(recipent, 2000, {
  from: sender
});
var gasPrice = web3.eth.gasPrice;
var gasLimit = 190000;
var count = web3.eth.getTransactionCount(sender);
var rawTransaction = {
  "from": sender,
  "nonce": web3.toHex(count),
  "gasPrice": web3.toHex(gasPrice),
  "gasLimit": web3.toHex(gasLimit),
  "to": contractAddress,
  "value": "0",
  "data": data,
  "chainId": 0x03
};

var privKey = new Buffer(my_privkey, 'hex');
var tx = new Tx(rawTransaction);

tx.sign(privKey);
var serializedTx = tx.serialize();

web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash);
  else
    console.log(err);
});



//
//
// var count = web3.eth.getTransactionCount("0x527C809Fc45cc10FD749aadbB298cD98319e5649");
// var abiArray = JSON.parse(fs.readFileSync('tt3.json', 'utf-8'));
// var contractAddress = "0x37Db4d5E5c5B60C9d4CE2B8d09054E9595e9437a";
// var contract = web3.eth.contract(abiArray).at(contractAddress);
// var rawTransaction = {
//     "from": "0x527C809Fc45cc10FD749aadbB298cD98319e5649",
//     "nonce": web3.toHex(count),
//     "gasPrice": "0x04e3b29200",
//     "gasLimit": "0x7458",
//     "to": contractAddress,
//     "value": "0x0",
//     "data": contract.transfer.getData("0xCb...", 10, {from: "0x26..."}),
//     "chainId": 0x03
// };
//
// var privKey = new Buffer('fc3...', 'hex');
// var tx = new Tx(rawTransaction);
//
// tx.sign(privKey);
// var serializedTx = tx.serialize();
//
// web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
//     if (!err)
//         console.log(hash);
//     else
//         console.log(err);
// });
//
//
//
// // Rather than using a local copy of geth, interact with the ethereum blockchain via infura.io
// const web3 = new Web3(Web3.givenProvider || `https://ropsten.infura.io/` + infura_api_key)
// // Create an async function so I can use the "await" keyword to wait for things to finish
// const main = async () => {
//   console.log('ShitCoin APP')
//   // This code was written and tested using web3 version 1.0.0-beta.26
//
//   // Who holds the token now?
//   var myAddress = "0x527C809Fc45cc10FD749aadbB298cD98319e5649";
//
//   // Who are we trying to send this token to?
//   var destAddress = "0x8D77E459622e56270E323E6795fE10393b214756";
//
//   // If your token is divisible to 8 decimal places, 42 = 0.00000042 of your token
//   var transferAmount = 1;
//
//   // Determine the nonce
//   console.log("Getting transaction count...");
//   try {
//     var count = await web3.eth.getTransactionCount(myAddress).catch(e);
//     console.log(`num transactions so far: ${count}`);
//   } catch (error) {
//     console.error(error);
//   }
//
//
//   // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
//   var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tt3.json'), 'utf-8'));
// console.log(`MY ADDDESS ${myAddress} \n ABI:${abiArray}`)
//   // This is the address of the contract which created the ERC20 token
//   var contractAddress = "0x37Db4d5E5c5B60C9d4CE2B8d09054E9595e9437a";
//   var contract = web3.eth.contract(abiArray); //new web3.eth.Contract(abiArray, contractAddress, { from: myAddress });
//
//   // How many tokens do I have before sending?
//   var balance = await contract.methods.balanceOf(myAddress).call();
//   console.log(`Balance before send: ${balance}`);
//
//   // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
//   var rawTransaction = {
//       "from": myAddress,
//       "nonce": "0x" + count.toString(16),
//       "gasPrice": "0x003B9ACA00",
//       "gasLimit": "0x250CA",
//       "to": contractAddress,
//       "value": "0x0",
//       "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
//       "chainId": 0x01
//   };
//
//   // Example private key (do not use): 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
//   // The private key must be for myAddress
//   var privKey = new Buffer(my_privkey, 'hex');
//   var tx = new Tx(rawTransaction);
//   tx.sign(privKey);
//   var serializedTx = tx.serialize();
//
//   // Comment out these three lines if you don't really want to send the TX right now
//   console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
//   var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
//   console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
//
//   // The balance may not be updated yet, but let's check
//   balance = await contract.methods.balanceOf(myAddress).call();
//   console.log(`Balance after send: ${balance}`);
// }
//
// main();
