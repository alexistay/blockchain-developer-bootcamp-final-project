# Lucky Draw Winner Picker
This project was inspired due to the controversies in 2019 when Justin Sun promised to give away a Tesla to one lucky Twitter follower. There were reportedly [88 draws][1] done, and even though a video was released of the draw process, it was later claimed that there was a gitch in the selection process and the draw was conducted again. The second winner somehow also [appeared in a frame][2] in the original video. 

[1]: https://twitter.com/CryptoJohnGalt/status/1111146257203056640?s=20
[2]: https://twitter.com/CryptoJohnGalt/status/1111146265100853248?s=20

The main idea is to use the blockchain such that
* the draw can only be conducted once
* 1 or more winners are selected randombly by the blockchain
* users can ascertain that they are in the list of entries
* users can get the number of entries
* users cannot get the entire list of entries (privacy issue)


# Work Flow
## Lucky Draw Operator
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

## Lucky Draw Participant
1. Visits webpage and loads lucky draw with lucky draw Id given.
2. Downloads the concatenated hashed salted entries from IPFS based on the IPFS cid stored in the lucky draw, and confirms that the hash of the concatenated hashed salted entries matches that stored in the lucky draw.
3. Salt their own entry, hash it, and confirm that the hashed salted entry is within the concatenated hashed salted entries.

## Design Considerations
* Complete list of entries should not be stored on the blockchain due to size issues
  * Entries are stored on IPFS to reduce amount of data stored on the blockchain.
  * Stored on the blockchain:
    * IPFS cid - to download entries when needed.
    * Hash of entries - to confirm that the entries are correct and not changed.
* All entries should not be visible to the public.
  * Entries are hashed before stored on IPFS. Actual entries are never uploaded.
* Purpose of the salt
  * Random number used to pick the winner is based on the hash of the following:
    * block.difficulty
    * block.timestamp
    * Lucky Draw ID
    * Existing number of winners
  * As the block.timestamp is controlled by the block proposer, it is possible for the block proposer to control the choice of winner.
  * In order to prevent this, the entries are salted before hashed. The block proposer will not be able know the actual entries as they do not have access to the salt when the lucky draw winner is picked.
  * However, collusion between lucky draw operators and block proposer is possible.
* Lucky draw entrants need to be able to verify that their entry has been submitted, without seeing the entire list of entries.
  * The salt is saved to the blockchain only after the lucky draw winners have been picked.
  * Lucky draw entrants can add the salt to their entry, hash it, and check that the hash is in the list of hashes.
  * They can also verify that the list of hashes is not modified by downloading the list of hashes from IPFS, hash it, and comparing it to the hash stored on the blockchain.
 
# Directory Structure
* `client` - frontend files
* `contracts` - solidity contract files
* `migrations` - truffle migration scripts
* `test` - truffle javascript test files for smart contract

# Frontend URL (deployed for Ropsten)
* https://damp-wave-55127.herokuapp.com/

# Video Walkthru
* https://youtu.be/A7PKfkv-7Ko
# Running on Ganache

## Clone Project
```
git clone https://github.com/alexistay/blockchain-developer-bootcamp-final-project
cd blockchain-developer-bootcamp-final-project
``` 
## Installing Dependencies
* Install Node.js (System specific, tested with v17.0.1)
* Install project dependencies (includes truffle, ganache-cli)
```
npm install
``` 
## Deploy locally
* Run Ganache listening on port 8545 using mnemonic specified in .env.example (specifying mnemonic is optional)
```
npx ganache-cli --port 8545 --mnemonic "`head -n 1 .env.example | cut -c 10-`"
```
* In a new terminal window
  * Compile smart contract
  * Deploy smart contract
```
npx truffle compile
npx truffle migrate
```
## Run Smart Contract Tests
```
npx truffle test
```
## Accessing Locally
* Start local http server (this is a super simple http server that serves out static files only) 
```
npm start
```
* Configure metamask on browser to use RPC URL `http://localhost:8545` 
* Import metamask account private key `0x5e3ed08fab0504e92e831a1402b706dc709ac0ddbc7843ea9d882e91c4db7552` or use mnemonic specified in `.env.example`, i.e.
```
payment mushroom trim regular august camp despair kitten hotel impact champion paddle
````
*  Access web UI via `http://127.0.0.1:8081`
# Running on Ropsten testnet
* Copy `.env.example` to `.env` and add your metamask Ropsten seed phrase and Infrua API-KEY and Etherscan API (to verify contract on Ropsten)
* Fund the first account with some test Ropsten eth
* Compile contract `npx truffle compile`
* Migrate contract `npx tuffle migrate --network ropsten`
* Verify contract on Ropsten testnet (optional) `npx truffle run verify LuckyDrawController --network ropsten`
* Git add & commit smart contract addresses and ABI `git add . && git commit -m
* Install heroku cli (system specific)
* Create heroku app `heroku create`
* Deploy frontend to heroku `npm run heroku`
* Access web UI with metamask set to Ropsten testnet
# Public Ethereum wallet for certification:
* `0x5B0d420c2b2EA93aAA870B86E0F24EaD4932F46E`

# TODO
* Better UI. 
  * Seperate UI for verifying lucky draws vs creating.
  * React App?
* IPFS pinning.
* Chainlink VRF for generating random numbers to pick winners. 


