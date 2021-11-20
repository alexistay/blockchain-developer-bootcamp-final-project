## Lucky Draw Winner Picker
This project was inspired due to the controversies in 2019 when Justin Sun promised to give away a Tesla to one lucky Twitter follower. There were reportedly [88 draws][1] done, and even though a video was released of the draw process, it was later claimed that there was a gitch in the selection process and the draw was conducted again. The second winner somehow also [appeared in a frame][2] in the original video. 

[1]: https://twitter.com/CryptoJohnGalt/status/1111146257203056640?s=20
[2]: https://twitter.com/CryptoJohnGalt/status/1111146265100853248?s=20

The main idea is to use the blockchain such that
* the draw can only be conducted once
* random winner is selected by the blockchain
* users can ascertain that they are in the list of entries
* users cannot get the entire list of entries
* users can get the number of entries

## Work Flow
### Lucky Draw Operator
1. Lucky draw operator visits webpage and signs up for a draw and gets a draw ID.
2. Operator publishes draw ID. This draw ID is used so that there the operator cannot draw multiply times until his desired winner comes up and then show the out come of that draw.
3. Operator allows people to enter the draw and gets a list of entries. This is not part of the scope of the project.
4. Operator submits list of entries and a salt to website.
   1. Website adds a salt to each entry, hashs each entry
   2. Website saves the list of hashed salted entry to IPFS
   3. Website hashes the hashed salted entry.
   4. IPFS cid and final hash is submitted and saved on blockchain.
5. Operator gets the winners from the webpage via the blockchain.
6. Once all the desired number of winnerse are obtained, operator submits and saved salt onto the blockchain.

### Lucky Draw Participant
1. Visits webpage and loads lucky draw with lucky draw Id given.
2. Downloads the concatenated hashed salted entries from IPFS based on the IPFS cid stored in the lucky draw, and confirms that the hash of the concatenated hashed salted entries matches that stored in the lucky draw.
3. Salt their own entry, hash it, and confirm that the results is within the concatenated hashed salted entries.

## Directory Structure
* `client` - frontend files
* `contracts` - solidity contract files
* `migrations` - truffle migration scripts
* `test` - truffle javascript test files for smart contract

## Deployed version url
* [https://damp-wave-55127.herokuapp.com/ ](https://damp-wave-55127.herokuapp.com)

## Installing Dependencies
```
npm install
``` 
## Accessing Project
Clone to local folder
```
git clone xxx
```
Install Dependencies
```
node install
```
Deploy project to heroku
```
npm run heroku
```
## Running Smart Contract Unit Tests
* Run ganache-cli listening on port 8545 and chain 1337 (should be the default) and then run `truffle test`
```
ganache-cli -m
truffle test
```
## Public Ethereum wallet for certification:
* `0x5B0d420c2b2EA93aAA870B86E0F24EaD4932F46E`

## TODO
* Better UI. 
  * Seperate UI for verifying lucky draws vs creating.
  * React App?
* IPFS pinning.
* Chainlink VRF for generating random numbers to pick winners. 


