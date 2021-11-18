## Lucky Draw Winner Picker
This project was inspired due to the controversies in 2019 when Justin Sun promised to give away a Tesla to one lucky Twitter follower. There were reportedly 88 draws done, and even though a video was released of the draw process, it was later claimed that there was a gitch in the selection process and the draw was conducted again. The second winner somehow also appeared in a frame in the original video. https://twitter.com/Tronics4L/status/1111322264828628992

The main idea is to use the blockchain such that
* the draw can only be conducted once
* random winner is selected by the blockchain
* users can ascertain that they are in the list of entries
* users cannot get the entire list of entries
* users can get the number of entries

## Work Flow
1. Contest operator visits webpage and signs up for a draw and gets a draw ID.
2. Operator publishes draw ID. This draw ID is used so that there can only be 1 draw done.
3. Operator allows people to enter the draw and gets a list of entries. This is not part of the scope of the project.
4. Operator submits list of entries to website.
5. Webpage choose a random winner from entries via the blockchain


## Directory Structure
* `client` - frontend files
* `contracts` - solidity contract files
* `migrations` - truffle migration scripts
* `test` - truffle javascript test files for smart contract

## Deployed version url
* vercel.app

## Installing Dependencies
* `npm install` 
## Accessing Project

## Running Smart Contract Unit Tests
* Run ganache-cli listening on port 8545 (should be the default) and then run `truffle test`
```
ganache-cli -m
truffle test
```
## Simple Workflow
### Create Lucky Draw

### Verify Lucky Draw

## Public Ethereum wallet for certification:
* `0x5B0d420c2b2EA93aAA870B86E0F24EaD4932F46E`


## TODO
* Better UI. 
  * Seperate UI for verifying lucky draws vs creating.
  * React App?
* IPFS pinning.
* Chainlink VRF for generating random numbers to pick winners. 


