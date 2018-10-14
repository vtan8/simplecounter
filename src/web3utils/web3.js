const Web3 = require('web3');

let provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/94e0fa0789d2451da3c0d39c218999ee');

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  provider = window.web3.currentProvider
}

export default new Web3(provider);

