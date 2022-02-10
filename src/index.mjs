import dotenv from 'dotenv'
import Web3 from 'web3'
import path from 'path'
import fs from 'fs'

const env = process.env.ENV_TYPE || 'local'
let env_path = path.resolve(process.cwd(), '.env.' + env)
let useDotFile = true

try {
  if (!fs.existsSync(env_path)) {
    console.log('env path (' + env_path + ') does not exist, trying default')
    env_path = path.resolve(process.cwd(), '.env')
    if (!fs.existsSync(env_path)) {
      console.log('default env path (' + env_path + ') does not exist')
      useDotFile = false
    }
  }
} catch (err) {
  console.log('err', err)
}

if (useDotFile) {
  dotenv.config({ path: env_path })
  console.log(
    '----------------- Using dotenv file ' + env_path + ' -----------------'
  )
} else {
  console.log('Using global ENV...')
}

export const web3 = new Web3(process.env.ROPSTEN_ENDPOINT)

export const getAverageGas = async (denomation = 'ether') => {
  const avg_gas = await web3.eth.getGasPrice()
  return web3.utils.fromWei(avg_gas, denomation)
}

export const hashVal = (string) => web3.utils.sha3(string)

export const solidityHashVal = (string) => web3.utils.soliditySha3(string)

export const randomHex = (number) => web3.utils.randomHex(number)

export const generateAccount = () => web3.eth.accounts.create()

const getBalance = async (address, denomination = 'ether') =>
  web3.utils.fromWei(await web3.eth.getBalance(address), denomination)

export const dummyAccount1 = {
  address: '0xE5Cf4891dC92D8db7C219362773C262a91FCF748',
  privateKey:
    '0xf2291888659d2212ce25417f00197c04744be7ae840bcf7b25d8139d564333f8',
}

export const dummyAccount2 = {
  address: '0x709A83f18A731408E42234bc78848e91215f6Bcb',
  privateKey:
    '0x545406f0641e4c38343d09bdaf77df32bf2845952ddd7c3d08c288f1af200a9b',
}

console.log('---------------------- BEFORE ----------------------')

console.log('dummyAccount1.address', await getBalance(dummyAccount1.address))
console.log('dummyAccount2.address', await getBalance(dummyAccount2.address))

console.log('----------------------------------------------------')

// Build tx

const txObj = {
  to: dummyAccount2.address,
  value: web3.utils.toWei('0.00001', 'ether'),
  gas: '21000',
  gasPrice: web3.utils.toWei('10', 'gwei'),
}

// Sign tx

const signedTx = await web3.eth.accounts.signTransaction(
  txObj,
  dummyAccount1.privateKey
)

// Broadcast tx

await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

console.log('---------------------- AFTER ----------------------')

console.log('dummyAccount1.address', await getBalance(dummyAccount1.address))
console.log('dummyAccount2.address', await getBalance(dummyAccount2.address))

console.log('---------------------------------------------------')
